# InstanceCreators

Some serializable classes can't be initiated via an empty constructor. This is where ``InstanceCreators`` come in. For
example, an ``EnumMap`` needs the enum class as a constructor parameter. So we can use the ``Type`` parameter retrieved 
when calling a serialization function to pass the enum class.

```kotlin title="EnumMapInstanceCreator"
object EnumMapInstanceCreator : InstanceCreator<EnumMap<*, *>> {
    
    override fun createInstance(type: KType): EnumMap<*, *> {
        val clazz = type.arguments[0].type!!.classifierClass!!.java
        return createEnumMap(clazz)
    }
    
    @Suppress("UNCHECKED_CAST")
    private fun <E : Enum<E>> createEnumMap(clazz: Class<*>): EnumMap<*, *> {
        return EnumMap<E, Any>(clazz as Class<E>)
    }

}
```

You can register it similarly to [``BinaryAdapters``](binaryadapter.md).

```kotlin
registerInstanceCreator(EnumMap::class, EnumMapInstanceCreator)
```

!!! note

    This instance creator is registered by default.