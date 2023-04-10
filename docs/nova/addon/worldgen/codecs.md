# Codecs

<div class="annotate" markdown>

`Codecs` are Mojang's way of serializing and deserializing objects via Json and NBT. They are relevant in world generation
because they are used to deserialize pretty much every aspect of datapack-supported world generation. In simpler terms,
a `Codec` is pretty much just a `Encoder` and `Decoder` combined defining how to serialize and deserialize an object into
primitive types. (1) So here's a quick overview on how to use them.

</div>

1. Minecraft also includes a ton of other default `Codecs` in the `ExtraCodecs` class. Make sure to check it out as well!

## DataResults

Before getting into `Codecs`, we need to take a look at `DataResults`. A `DataResult` is pretty much just a fancier version of
Kotlin's `Result` type. They either contain a value or an error. The difference is that `DataResult's` can contain a so
called `PartialResult` (which often is just the input value or a partially deserialized value). `Codecs` can be adapted
to serialize/deserialize using `DataResults` using the following functions:

* `Codec.comapFlatMap` - Deserialize into a `DataResult` but serialize normally.
* `Codec.flatComapMap` - Serialize into a `DataResult` but deserialize normally.
* `Codec.flatXmap` - Serialize and deserialize into a `DataResult`.

Keep these functions in mind for the following examples.

!!! tip

    Nova also has a `#!kotlin Result<R>.asDataResult()` extension function to convert Kotlin's `Result` into a `DataResult`.  
    So for a convenient way to safely deserialize a value and return a `DataResult`, you can run `#!kotlin runCatching { /* ... */ }.asDataResult()`

## DynamicOps

`DynamicOps` are Mojang's way of abstracting away the difference between different serialization formats. DFU includes
`JsonOps` by default. Minecraft adds `NbtOps` and `RegistryOps`. `DynamicOps` are used to define the format in which
primitive types are serialized and deserialized. All other types are built on top of these primitive types.

??? example "Number types implementation in `JsonOps`"

    For example, to serialize/deserialize numbers, `DynamicOps` defines the `createNumeric`  and `getNumberValue` functions.
    `JsonOps` implements these functions like this:
    
    ```java title="JsonOps.java"
    public JsonElement createNumeric(Number i) {
        return new JsonPrimitive(i);
    }
    
    public DataResult<Number> getNumberValue(JsonElement input) {
        if (input instanceof JsonPrimitive) {
            if (input.getAsJsonPrimitive().isNumber()) {
                return DataResult.success(input.getAsNumber());
            }
    
            if (input.getAsJsonPrimitive().isBoolean()) {
                return DataResult.success(input.getAsBoolean() ? 1 : 0);
            }
    
            if (this.compressed && input.getAsJsonPrimitive().isString()) {
                try {
                    return DataResult.success(Integer.parseInt(input.getAsString()));
                } catch (NumberFormatException var3) {
                    return DataResult.error("Not a number: " + var3 + " " + input);
                }
            }
        }
    
        return input instanceof JsonPrimitive && input.getAsJsonPrimitive().isBoolean() ? DataResult.success(input.getAsJsonPrimitive().getAsBoolean() ? 1 : 0) : DataResult.error("Not a number: " + input);
    }
    ```

## Codecs for simple types.

For classes that can be defined as a single type, a preexisting `PrimitveCodec` should be used to define the `Codec` for
that type. A simple example would be a `Codec` for Minecraft's `ResourceLocation`. Since a `ResourceLocation` can be 
constructed from a single `String`, we can use the preexisting `Codec.String` to define our `Codec`.

??? example "ResourceLocation implementation used for this example"

    To simplify, here's a more basic implementation of `ResourceLocation`:
    
    ```kotlin title="ResourceLocation.kt"
    data class ResourceLocation(
        val namespace: String,
        val location: String
    ) {
        
        override fun toString(): String {
            return "$namespace:$location"
        }
        
        companion object {
            
            /**
             * Matches any lowercase alphanumeric (and `_`) string that starts with a lowercase letter
             */
            val PART_PATTERN = Regex("""^[a-z][a-z\d_]*$""")
            
            /**
             * Matches the Pattern [PART_PATTERN] twice separated by a colon
             */
            val COMPLETE_PATTERN = Regex("""^[a-z][a-z\d_]*:[a-z][a-z\d_]*$""")
            
            fun read(id: String): DataResult<ResourceLocation> {
                val namespace: String
                val location: String
                
                if (id.matches(COMPLETE_PATTERN)) {
                    val parts = id.split(':')
                    namespace = parts[0]
                    location = parts[1]
                } else if (id.matches(PART_PATTERN)) {
                    namespace = "minecraft"
                    location = id
                } else {
                    return DataResult.error { "ResourceLocation \"$id\" does neither match pattern $COMPLETE_PATTERN nor $PART_PATTERN" }
                }
                
                return DataResult.success(ResourceLocation(namespace, location))
            }
            
        }
        
    }
    ```

```kotlin title="ResourceLocation.kt"
val CODEC: Codec<ResourceLocation> =
    Codec.STRING // (1)!
        .comapFlatMap(ResourceLocation::read, ResourceLocation::toString) // (2)!
        .stable() // (3)!
```

1. As mentioned above, we can use the preexisting `Codec.String` to define our `Codec` since we only need a single string to parse the `ResourceLocation`.
2. We use `comapFlatMap` to deserialize into a `DataResult` and serialize normally <small>(Calling `toString` shouldn't fail)</small>.  
   Also use `read` to deserialize the `ResourceLocation` from the provided `String`.
3. Specify that the `Codec` is stable.

So in other words, we're now just telling the serializer how to serialize and deserialize our `ResourceLocation` type 
to/from a `String`.

## Codecs for more nested types

In the previous example, we just mapped a preexisting `Codec` to our type. But what if we want to define a `Codec` for a
more complex type with multiple fields? For this, we can use `RecordCodecBuilder` to define a `Codec` for our type. Here's
the `data class` we want to define a `Codec` for:

```kotlin
data class Example(
    val id: ResourceLocation,
    val ints: List<Int>,
    val defaultString: String
)
```

So let's break this type down into its parts. We can see that `Example` has three fields: `id`, `ints` and `defaultString`.  

`id` 

:   `id` is a `ResourceLocation` which we already know how to serialize/deserialize. So we can just use our previously 
    defined Codec` again:

    ```kotlin
    ResourceLocation.CODEC // (1)!
        .fieldOf("id") // (2)!
        .forGetter(Example::id) // (3)!
    ```
    
    1. Use the previously defined `Codec` for `ResourceLocation`.
    2. Specify the name of the field in the serialized format.
    3. Specify how to get the value of the field from the `Example` instance.

`ints`

:   `ints` is a `List<Int>` which is just a list of the primitive type `Int`. So we can just call `Codec.INT.listOf()`
    to define a `Codec` for `List<Int>`:

    ```kotlin
    Codec.INT.listOf() // (1)!
        .fieldOf("ints") // (2)!
        .forGetter(Example::ints) // (3)!
    ```

    1. Use the `listOf` function on `Codec.INT` to define a `Codec` for `List<Int>`.
    2. Specify the name of the field in the serialized format.
    3. Specify how to get the value of the field from the `Example` instance.

`defaultString`

:   `defaultString` is a `String` which is a primitive type. But we want to make it optional with a default value of
    `"default"`. So we can use `Codec.STRING.optionalFieldOf` to define a `Codec` for `String` with a default value:

    ```kotlin
    Codec.STRING // (1)!
        .optionalFieldOf("defaultString", "default") // (2)!
        .forGetter(Example::defaultString) // (3)!
    ```

    1. Use the existing `Codec.STRING` for `String`.
    2. Specify the name of the field in the serialized format and the default value.  
       To specifiy a default-value for a non `MapCodec` use `Codec.String.orElse("default")`.
    3. Specify how to get the value of the field from the `Example` instance.

Putting all these together, we can now define a `Codec` for our `Example` type:

```kotlin
val CODEC: Codec<Example> = RecordCodecBuilder.create { instance ->
   instance.group(
           ResourceLocation.CODEC.fieldOf("id").forGetter(Example::id),
           Codec.INT.listOf().fieldOf("ints").forGetter(Example::ints),
           Codec.STRING
              .optionalFieldOf("defaultString", "default")
              .forGetter(Example::defaultString)
   ).apply(instance, ::Example)
}
```

1. List all the fields of the `Example` type.
2. Apply the fields to the `RecordCodecBuilder` instance and use the `::Example` constructor reference to specify how to
   construct an `Example` instance from the defined fields.

So let's test it out by serializing and deserializing an `Example` instance:

```kotlin
val testId = ResourceLocation("minecraft", "stone")
val test = Example(testId, listOf(1, 2, 3), "hello")
```

Using our `Codec` and `JsonOps`:

```json
{
  "id": "minecraft:stone",
  "ints": [1, 2, 3],
  "defaultString": "hello"
}
```

And now let's deserialize the same json, but without the `defaultString` field. And the result is:

```
Example(id=minecraft:stone, ints=[1, 2, 3], defaultString=default)
```

## Registry Codecs

### Minecraft/Nova registries

If you want to retrieve an instance of a type that is registered in one of Minecraft's/Nova's registries, you can use
the `Registry.byNameCodec` function. This will automatically build a `Codec` that will serialize/deserialize a `ResourceLocation`
and then use that `ResourceLocation` to retrieve the instance from the `Registry`. (`holderByNameCodec` also exists if
you need a `Holder` instead of an instance).

If you also want to allow the `Codec` to serialize/deserialize inline, you can use the `RegistryFileCodec` class. For example,
the `ConfiguredFeature` class has both a `DIRECT_CODEC`, which only deserializes inline and a `CODEC`, which also checks
the `Registry` if the deserialized type is a `ResourceLocation`:

```java
public static final Codec<ConfiguredFeature<?, ?>> DIRECT_CODEC = BuiltInRegistries.FEATURE.byNameCodec().dispatch((config) -> { // (1)!
    return config.feature;
}, Feature::configuredCodec);

public static final Codec<Holder<ConfiguredFeature<?, ?>>> CODEC = RegistryFileCodec.create(Registries.CONFIGURED_FEATURE, DIRECT_CODEC);
```

1. Checks the individual `ConfiguredFeature` `Codecs` of each `Feature`.

### Custom registry-like types

If you want to define a `Codec` for a custom type that is registered in a custom registry-like type, you can use the
`ExtraCodecs.stringResolverCodec` and `ExtraCodecs.idResolverCodec` functions. These functions take 2 mapping `Functions`
as parameters: one for element to id and one for id to element (since primitives aren't nullable in Java, the `idResolverCodec`
function also takes a `int` that represent the id of non-existing elements).

For example, let's say we have a custom `Registry` that maps `String` to a generic `T`:

```kotlin
class SimpleRegistry<T : Any> {
    
    private val byId: MutableMap<String, T> = mutableMapOf()
    private val byValue: MutableMap<T, String> = mutableMapOf()
    
    fun register(id: String, value: T) {
        byId[id] = value
        byValue[value] = id
    }
    
}
```

We can define a `codec` function:

```kotlin
fun codec(): Codec<T> {
    return ExtraCodecs.stringResolverCodec(byValue::get, byId::get)
}
```

### Enums

Minecraft also provides a built-in way of serializing/deserializing enums. Just implement the `StringRepresentable` interface
and implement the `getSerializedName` function:

```kotlin
enum class ExampleEnum: StringRepresentable {
    A, B, C;
    
    override fun getSerializedName() = this.name
    
    companion object {
        val VALUES = values()
    }
}
```

Now we can call `StringRepresentable.fromEnum` to get a `Codec` for our enum:

```kotlin
companion object {
    val VALUES = values()
    
    val CODEC = StringRepresentable.fromEnum(::VALUES)
}
```

## More utilities

!!! info "Note"

    This section isn't required to properly use `Codecs`, but it contains a lot of useful utilities that might save you
    some time in the future.

### Either/Xor

If your `Codec` should be able to serialize/deserialize 2 different types, you can use the `Codec.either` function 
(or `EitherCodec` class) to define a `Codec` that can serialize/deserialize both types. One common use case is accepting
both a `ResourceLocation` and a `TagKey`:

!!! tip "Already built into Nova"
    Nova already provides a `ResourceLocationOrTagKey` class that wraps an `Either<ResourceLocation, TagKey<T>>` and
    provides a `Codec` via the `codec` function.

```kotlin
val CODEC: Codec<Either<ResourceLocation, TagKey<Biome>>> = Codec.either(
    ResourceLocation.CODEC,
    TagKey.hashedCodec(Registries.BIOME)
)
```

If you only want to allow one of the types (sometimes both types could be deserialized and lead to confusion), you can
use the `ExtraCodecs.xor` function:

```kotlin
val CODEC: Codec<Either<ResourceLocation, TagKey<Biome>>> = ExtraCodecs.xor( // (1)!
    ResourceLocation.CODEC,
    TagKey.hashedCodec(Registries.BIOME)
)
```

1. Please note that this is redundant here since `TagKey` needs to start with `#` and `ResourceLocation` can't start 
   with `#`. But it can be useful for other types.


### Number codecs within a range

If you want to serialize/deserialize a number but only within a certain range, you can use the `Codec.intRange`, `Codec.floatRange`
and `Codec.doubleRange` functions:

```kotlin
val CHANCE_CODEC: Codec<Float> = Codec.floatRange(0.0f, 1.0f)
```

### Pair like types

Some types might usually need a `RecordCodecBuilder` to be serialized/deserialized, but if they only have 2 fields of the
same type, you can use the `ExtraCodecs.intervalCodec` function:

```kotlin title="IntRange Codec"
val INT_RANGE_CODEC: Codec<IntRange> = ExtraCodecs.intervalCodec(
    Codec.INT,
    "min_inclusive",
    "max_inclusive",
    { min, max -> runCatching { IntRange(min, max) }.asDataResult() },
    IntRange::start,
    IntRange::endInclusive
)
```

### Catching Exceptions

If you don't want to deal with `DataResults` while decoding and just want to throw exceptions instead, you can wrap your
`Codec` via the `ExtraCodecs.catchDecoderException` function:

```kotlin
val CODEC: Codec<Example> = ExtraCodecs.catchDecoderException(Example.CODEC)
```

this will catch any `Exceptions` thrown while decoding and turn them into `DataResult` errors.