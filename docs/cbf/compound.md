# Compound

A `Compound` is a key-value store that serializes its data using the registered [serializers](serialization.md).

Data is deserialized lazily. This means that until you specifically request a value, it will be
stored as binary data (It will of course be cached after the first time it is requested).

## Basic usage

```kotlin
val compound = Compound()
compound["test1"] = 123
compound["test2"] = "test"
compound["test3"] = true
compound["test4"] = mapOf("test" to 123, "test2" to 321)
compound["test5"] = Compound().apply { this["list"] = listOf(123, 321) }
```

This will create a compound with the following data:

```
{
    "test1": 123
    "test2": test
    "test3": true
    "test4": {test=123, test2=321}
    "test5": {
        "list": [123, 321]
    }
}
```

We can serialize it the same way we serialize any other object:

```kotlin
val bytes = Cbf.write(compound)
```

We can then deserialize it, and get back the same data:

```kotlin
val compound = Cbf.read<Compound>(bytes)!!
println(compound.get<Int>("test1")) // prints 123
println(compound.get<String>("test2")) // prints test
println(compound.get<Boolean>("test3")) // prints true
println(compound.get<Map<String, Int>>("test4")) // prints {test=123, test2=321}
println(compound.get<Compound>("test5")!!.get<List<Int>>("list")) // prints [123, 321]
```

## Entry providers

Using `#!kotlin Compound.entry<T>(key: String)`, you can obtain a 
[MutableProvider<T?\>](https://commons.dokka.xenondevs.xyz/commons-provider/xyz.xenondevs.commons.provider/-mutable-provider/index.html)
that will contain the value of type `T` under the given key.

### Non-defaulting

Non-defaulting entry providers will contain `null` if there is no value under the given key.

```kotlin
val compound = Compound()
var entry: Int? by compound.entry<Int>("a")
```

Changing the value of the provider updates the value stored inside the compound:

```kotlin
println(entry) // null
entry = 1
println(entry) // 1
println(compound["a"]) // 1
```

And vice versa, if you update the value inside the compound, the provider will be automatically updated as well:

```kotlin
compound["a"] = 2
println(entry) // 2
```

Once you've registered an entry provider for a key, the type under this key is constrained to the type of the entry
provider.

```kotlin
val compound = Compound()

// no entry provider: type under key "a" can be changed
compound["a"] = 1
compound["a"] = "1"

// with entry provider: type is constrained to provider's type
var entry: String? by compound.entry<String>("a")
compound["a"] = 1 // IllegalArgumentException: kotlin.Int (value type) is not a subtype of kotlin.String? (entry type)
```

### Defaulting

Defaulting entry providers cannot be `null`. Instead, a default value is lazily generated using a predefined lambda
if there initially is no value under the given key.

```kotlin
val compound = Compound()
var entry: Int by compound.entry<Int>("a") { 1 }

println(entry) // 1
println(compound["a"]) // 1
```

Note that defaulting entry providers introduce an additional type constraint of non-nullability to the type under the
key, meaning entries cannot be removed (i.e. set to `null`).

```kotlin
val compound = Compound()

// non-defaulting entry provider: value can be removed (set to null)
var entry: Int? by compound.entry<Int>("a")
compound["a"] = null

// default entry provider: value cannot be removed (set to null)
var entry1: Int by compound.entry<Int>("b") { 1 }
compound["b"] = null // IllegalArgumentException: kotlin.Nothing? (value type) is not a subtype of kotlin.Int (entry type)
```