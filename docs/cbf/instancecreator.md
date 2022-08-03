# InstanceCreators

Some serializable classes can't be initiated via an empty constructor. This is where ``InstanceCreators`` come in. For
example, an ``EnumMap`` needs the enum class as a constructor parameter. So we can use the ``Type`` parameter retrieved 
when calling a serialization function to pass the enum class.

```kotlin title="EnumMapInstanceCreator"
object EnumMapInstanceCreator : InstanceCreator<EnumMap<*, *>> {
    
    private val ENUM_MAP_CONSTRUCTOR = EnumMap::class.java.getConstructor(Class::class.java)
    
    override fun createInstance(type: Type): EnumMap<*, *> {
        return ENUM_MAP_CONSTRUCTOR.newInstance((type as ParameterizedType).actualTypeArguments[0] as Class<*>)
    }
    
}
```

You can register it similarly to [``BinaryAdapters``](binaryadapter.md).

```kotlin
registerInstanceCreator(EnumMap::class, EnumMapInstanceCreator)
```