# Compound

Compounds allow you store a lot of data in a single object. This makes it easier to get desired data on demand instead of
continuously reading from a byte stream. You can pretty much see compounds as maps or json objects. Similar to json, data
in compounds can be nested and is deserialized lazily. This means that until you specifically request a value, it will be
stored as a byte array (It will of course be cached after the first time it is requested). Let's see create a compound:

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
val bytes = CBF.write(compound)
```

We can then deserialize it, and get back the same data:

```kotlin
val compound = CBF.read<Compound>(bytes)!!
println(compound.get<Int>("test1")) // prints 123
println(compound.get<String>("test2")) // prints test
println(compound.get<Boolean>("test3")) // prints true
println(compound.get<Map<String, Int>>("test4")) // prints {test=123, test2=321}
println(compound.get<Compound>("test5")!!.get<List<Int>>("list")) // prints [123, 321]
```