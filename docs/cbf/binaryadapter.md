# BinaryAdapters

Binary adapters are used to serialize and deserialize objects into binary data.
 
??? example "Default adapters"

    The following adapters are available by default:

    * Byte
    * ByteArray
    * Short
    * ShortArray
    * Int
    * IntArray
    * Long
    * LongArray
    * Float
    * FloatArray
    * Double
    * DoubleArray
    * Boolean
    * BooleanArray
    * Char
    * CharArray
    * String
    * StringArray
    * Enum
    * UUID
    * Pair
    * Triple
    * Map
    * Collection
    * Compound

## Creating your own adapter

Creating your own adapter is easy. You just need to implement the `BinaryAdapter` interface and register it via the
``CBF.registerBinaryAdapter`` function. If you also want subclasses of a type to be serialized, you can use the
``CBF.registerBinaryHierarchyAdapter`` function. (For example, the Collection adapter)

Let's create a simple adapter that serializes and deserializes a ``java.awt.Color`` instance.

```kotlin title="ColorAdapter"
object ColorBinaryAdapter : BinaryAdapter<Color> {
    
    override fun read(type: Type, buf: ByteBuffer): Color {
        return Color(buf.readInt(), true)
    }
    
    override fun write(obj: Color, buf: ByteBuffer) {
        buf.writeInt(obj.rgb)
    }
    
}
```

and register it:

```kotlin
CBF.registerBinaryAdapter(Color::class, ColorBinaryAdapter)
```

If you have generic types, you can use the type parameter.

```kotlin title="PairBinaryAdapter"
object PairBinaryAdapter : BinaryAdapter<Pair<*, *>> {
    
    override fun write(obj: Pair<*, *>, buf: ByteBuffer) {
        CBF.write(obj.first, buf)
        CBF.write(obj.second, buf)
    }
    
    override fun read(type: Type, buf: ByteBuffer): Pair<*, *> {
        val typeArguments = (type as ParameterizedType).actualTypeArguments
        
        return Pair<Any?, Any?>(
            CBF.read(typeArguments[0], buf),
            CBF.read(typeArguments[1], buf)
        )
    }
    
}
```

The registration works the same way:

```kotlin
CBF.registerBinaryAdapter(Pair::class, PairBinaryAdapter)
```