## Serialization

To serialize objects, you can use `#!kotlin CBF.write`:

```kotlin
val out = ByteArrayOutputStream()
val writer = ByteWriter.fromStream(out)
val list = listOf("test1", "test2", "test3")
CBF.write(list, writer)
val bytes = out.toByteArray()
```

or

```kotlin
val list = listOf("test1", "test2", "test3")
val bytes = CBF.write(list)
```

## Deserialization

To deserialize binary data, you can use `#!kotlin CBF.read`:

```kotlin
val inp: InputStream // ...
val reader = ByteReader.fromStream(inp)
val list = CBF.read<List<String>>(reader)
```

or

```kotlin
val list = CBF.read<List<String>>(bytes)
```
