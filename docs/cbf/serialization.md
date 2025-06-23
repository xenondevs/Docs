## Serialization Basics

In CBF, `BinarySerializers` define how objects are (de)serialized to and from binary data.
These serializers are then centrally registered at the `Cbf` singleton object.

??? example "Default serializers"

    Serializers for the following types are registered by default:  
    `Byte`, `ByteArray`, `Short`, `ShortArray`, `Int`, `IntArray`, `Long`, `LongArray`, `Float`, `FloatArray`,
    `Double`, `DoubleArray`, `Boolean`, `BooleanArray`, `Char`, `CharArray`, `String`, `Array<String>`, 
    `Enum`, `UUID`, `kotlin.Uuid`, `Pair`, `Triple`, `List<T>`, `Set<T>`, `Map<K, V>`, `Compound`

### Serializing

To serialize objects, you can use `#!kotlin Cbf.write`:

```kotlin
val out: OutputStream // ...
val writer: ByteWriter = ByteWriter.fromStream(out)
val list: List<String> = listOf("test1", "test2", "test3")
Cbf.write(list, writer)
```

or

```kotlin
val list: List<String> = listOf("test1", "test2", "test3")
val bytes: ByteArray = Cbf.write(list)
```

### Deserializing

To deserialize binary data, you can use `#!kotlin Cbf.read`:

```kotlin
val inp: InputStream // ...
val reader: ByteReader = ByteReader.fromStream(inp)
val list: List<String>? = Cbf.read<List<String>>(reader)
```

or

```kotlin
val list: List<String>? = Cbf.read<List<String>>(bytes)
```

!!! note "Serializer type is chosen at compile-time"

    The type of the serializer that is chosen is determined by the type parameter of the `Cbf.read` and `Cbf.write`
    methods, which means that it is determined statically at compile-time. This also means that you can also choose
    to serialize the value as a supertype, e.g. `Cbf.write<Any>(list)` would look for a serializer for `Any`.

## Configuring existing serializers

Some built-in serializers allow extra configuration via the `Cbf` object.
For example, you can specify which enums should be serialized via their ordinal value instead of their name using
`#!kotlin Cbf.addOrdinalEnums` or tell CBF how to create instances of certain collection types via
`#!kotlin Cbf.addCollectionCreator`, `#!kotlin Cbf.addMapCreator`.


## Custom Serializers

You can create a custom serializer by implementing the `#!kotlin BinarySerializer<T>` interface.
However, for most cases, it is easier to extend `#!kotlin UnversionedBinarySerializer<T>` or `#!kotlin VersionedBinarySerializer<T>` instead.

### Unversioned binary serializers

`UnversionedBinarySerializer` is a serializer that has already implemented null handling by writing an unsigned byte
`0` byte for `null` and `1`, followed by the serialized data, for non-null values.
If you want to change the binary format at a later point, you can switch to `VersionedBinarySerializer` without
introducing a breaking change, as the remaining values in the leading byte will then be used to indicate the format version.

This is how you can implement an `UnversionedBinarySerializer` for an example `Person` class:
```kotlin
data class Person(
    val id: Int,
    val firstName: String,
    val lastName: String
)

object PersonSerializer : UnversionedBinarySerializer<Person>() {
    
    override fun readUnversioned(reader: ByteReader): Person {
        return Person(
            id = reader.readInt(),
            firstName = reader.readString(),
            lastName = reader.readString()
        )
    }
    
    override fun writeUnversioned(obj: Person, writer: ByteWriter) {
        writer.writeInt(obj.id)
        writer.writeString(obj.firstName)
        writer.writeString(obj.lastName)
    }
    
    override fun copyNonNull(obj: Person): Person {
        return obj.copy()
    }
    
}
```

```kotlin
Cbf.registerSerializer(PersonSerializer)
```

### Versioned binary serializers

`VersionedBinarySerializer` allows reading older formats of the data and writing to a new format.

In the following example, an `address` field has been added to the `Person` class used above.
We can now swap out our `UnversionedBinarySerializer` for a `VersionedBinarySerializer`.
The format is now at version `2`, as the previous version was `1`. (`0` is reserved for null values)
```kotlin
data class Person(
    val id: Int,
    val firstName: String,
    val lastName: String,
    val address: String // new
)

object PersonSerializer : VersionedBinarySerializer<Person>(2.toUByte()) {
    
    override fun readVersioned(version: UByte, reader: ByteReader): Person {
        when (version) {
            // legacy format
            1.toUByte() -> Person(
                id = reader.readInt(),
                firstName = reader.readString(),
                lastName = reader.readString(),
                address = ""
            )
            
            // new format
            2.toUByte() -> Person(
                id = reader.readInt(),
                firstName = reader.readString(),
                lastName = reader.readString(),
                address = reader.readString() // new
            )
            
            else -> throw UnsupportedOperationException()
        }
    }
    
    override fun writeVersioned(obj: Person, writer: ByteWriter) {
        writer.writeInt(obj.id)
        writer.writeString(obj.firstName)
        writer.writeString(obj.lastName)
        writer.writeString(obj.address)
    }
    
    override fun copyNonNull(obj: Person): Person {
        return obj.copy()
    }
    
}
```

```kotlin
Cbf.registerSerializer(PersonSerializer)
```

### Serializer factory

For some types, especially container types like `#!kotlin List<T>` or `#!kotlin Pair<A, B>`, it is necessary to create
a custom serializer per generic type parameter. This can be achieved using a `BinarySerializerFactory`:

The following example shows how to create a serializer for `#!kotlin Pair<A, B>`, where `A` and `B` are in turn also serialized
via a dynamically chosen `#!kotlin BinarySerializer<A>` and `#!kotlin BinarySerializer<B>`.
```kotlin 
internal class PairBinarySerializer<A : Any, B : Any>(
    private val aSerializer: BinarySerializer<A>,
    private val bSerializer: BinarySerializer<B>
) : UnversionedBinarySerializer<Pair<A?, B?>>() {
    
    override fun writeUnversioned(obj: Pair<A?, B?>, writer: ByteWriter) {
        aSerializer.write(obj.first, writer)
        bSerializer.write(obj.second, writer)
    }
    
    override fun readUnversioned(reader: ByteReader): Pair<A?, B?> {
        return Pair(
            aSerializer.read(reader),
            bSerializer.read(reader)
        )
    }
    
    override fun copyNonNull(obj: Pair<A?, B?>): Pair<A?, B?> {
        return Pair(
            aSerializer.copy(obj.first),
            bSerializer.copy(obj.second)
        )
    }
    
    companion object : BinarySerializerFactory {
        
        @OptIn(UncheckedApi::class)
        override fun create(type: KType): BinarySerializer<*>? {
            if (!type.isSubtypeOf(typeOf<Pair<*, *>?>())) // (1)!
                return null
            
            val typeA = type.arguments.getOrNull(0)?.type
                ?: return null
            val typeB = type.arguments.getOrNull(1)?.type
                ?: return null
            
            return PairBinarySerializer(
                Cbf.getSerializer(typeA),
                Cbf.getSerializer(typeB)
            )
        }
        
    }
    
}
```

1. Note that the `create` function is invoked for all types, not just subtypes of `Pair`, which is why it is necessary
    to check if the type is a subtype of `Pair<*, *>?` before proceeding.

```kotlin
Cbf.registerSerializerFactory(PairBinarySerializer)
```