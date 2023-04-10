# Configs

## Adding configs to your addon
In order to add configs to your addon, create a directory called `configs` in `resources`. There, you can add all
your .yml configs, which will automatically be extracted and handled the same way all Nova configs are.  
New or changed keys will automatically be added / updated on the server as well, unless they have been modified by an admin.

![](https://i.imgur.com/NdG1uX8.png)

## Accessing configs
To access the configs, retrieve them from `NovaConfig`.  
You can either use their names:
```kotlin
NovaConfig["example:ruby"] // namespace:name (drop the .yml)
```
Or if the name matches the name of one of your [items](items/registering-items.md), the NovaMaterial:
```kotlin
NovaConfig[Items.RUBY]
```

## Provider

To help with config reloading, Nova offers the `Provider` class. This class stores a value of a given type and can be
delegated to. `Providers` have an abstract `loadValue` function that, depending on its implementation, might load something
from a config, a CBF `Compound`, or anything else.  
Providers associated with configs will automatically reload their values when the config is reloaded.  
You can also chain value modification calls on a `Provider`. Those modification steps will then be run every time the
config is reloaded.

Some of those modification functions are:

* `map` - Maps the value to a new value.
* `orElse` - Falls back to a default value if the value is null.
* `flatMap` - Performs a flatMap operation for a `Provider<List<*>>`.
* `flatten` - Performs a flattening operation for a `Provider<List<List<*>>>`.
* `requireNonNull` - Throws an exception if the value is null.

Every time such a modification function is called, a new `Provider` is created and returned. This allows you to create
several modified versions from the same `Provider`.

You might also be interested in these `Provider`-related top-level functions:

* `provider` - Creates a static `Provider` from a given value.
* `combinedProvider` - Creates a `Provider<List<T>>` from a list of `Provider<T>`s.
* `lazyProvider` - Creates a `Provider` whose parent is only created lazily using the given `initializer` lambda.
* `combinedLazyProvider` - Creates a `Provider<List<T>>` from a list of `Provider<T>`s, where the `Provider<T>`s are
  created lazily using the given `initializer` lambda.
* `lazyProviderWrapper` - Creates a `Provider` that wraps a lazily initialized static value from given `initializer`
  lambda.

### configReloadable
The easiest way to create a `Provider` that is affected by config reloading is to use the `configReloadable` function:

```kotlin
object Example {
    val SOME_VALUE: Int by configReloadable { NovaConfig[Items.RUBY].getInt("some_value") }
}
```

Or if you need to pass the `Provider` somewhere, don't delegate:

```kotlin
object Example {
    val SOME_VALUE: Provider<Int> = configReloadable { NovaConfig[Items.RUBY].getInt("some_value") }
}
```

Or if you're required to pass a `Provider`, but the value actually isn't configurable nor reloadable:

```kotlin
val someValue: Provider<Int> = provider(0)
```

### ConfigAccess

You can also create entire classes that provide access to a config file. For that, inherit from `ConfigAccess`.
Then, you can call `getEntry<Type>(key)` or `getOptionalEntry<Type>(key)`, which will return a `Provider` for that value.

??? example "Example ConfigAccess Implementation"

    ```kotlin title="FoodOptions.kt"
    private class ConfigurableFoodOptions(item: NovaItem) : ConfigAccess(item) {
        
        val type: FoodType by getOptionalEntry<String>("food_type")
            .map { FoodType.valueOf(it.uppercase()) }
            .orElse(FoodType.NORMAL)
        val consumeTime: Int by getEntry<Int>("consume_time")
        val nutrition: Int by getEntry<Int>("nutrition")
        val saturationModifier: Float by getEntry<Float>("saturation_modifier")
        val instantHealth: Double by getOptionalEntry<Double>("instant_health").orElse(0.0)
        val effects: List<PotionEffect> by getOptionalEntry<List<PotionEffect>>("effects")
        
    }
    ```

!!! tip "Saving the `Provider` instance"

    Instead of delegating to the `Provider`, you might also find it useful to save the `Provider` instance in a property,
    and then create a second property that delegates to that `Provider`. This way, you can access the `Provider` instance
    to do further modifications to the value, without having to worry about config reloading not working. 