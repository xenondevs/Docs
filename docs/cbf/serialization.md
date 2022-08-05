# Serialization

To actually (de)serialize data, you need to use the CBF singleton.

## Serialization

To serialize data, you can use the ``write`` functions. You can either directly pass a ``ByteBuffer`` instance, or automatically 
let the previously set ``defaultBufferProvider`` provide one and get the bytes directly.

```kotlin
val buf = CBF.buffer() // Also uses the default buffer provider
val list = listOf("test1", "test2", "test3")
CBF.write(list, buf)
val bytes = buf.toByteArray()
```

or

```kotlin
val list = listOf("test1", "test2", "test3")
val bytes = CBF.write(list)
// ...
```

## Deserialization

Deserialization is pretty similar, but you obviously need to pass input data here. Both ``ByteBuffer`` and ``ByteArray`` are
supported.

```kotlin
val list = CBF.read<List<String>>(buffer)
```

or

```kotlin
val list = CBF.read<List<String>>(bytes)
```

Check out the [``Compound``](compound.md) section to see how to store related data in a single object.

!!! tip

    The ``NettyBufferProvider`` also registers a few extension functions allowing you to directly pass a netty ``ByteBuf``
    instead of the cbf buffer. You can also get a cbf buffer via Netty's ``ByteBufAllocator``. Just call ``ByteBufAllocator.cbfBuffer()``.