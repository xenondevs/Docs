# Configs

## Configuration Library
Nova uses [SpongePowered/Configurate](https://github.com/SpongePowered/Configurate), but most of the
time you'll be dealing with Nova's `Provider<ConfigurationNode>`, which helps you with config reloading.

## Provider

To help with config reloading, Nova offers the `Provider` class.  
Config providers are automatically reloaded when the config is reloaded.
You can also chain value modification calls on a `Provider`. Those modification steps will then be run lazily every time
the config is reloaded.

Some of those modification functions are:

* `map` - Maps the value to a new value.
* `orElse` - Falls back to a default value if the value is null.

Every time such a modification function is called, a new `Provider` is created and returned. This allows you to create
several modified versions from the same `Provider`.

You might also be interested in these `Provider`-related top-level functions:

* `#!kotlin provider(value: T)` - Creates a constant `Provider` from a given value.
* `#!kotlin provider(lazyValue: () -> T)` - Creates a `Provider` that loads it value lazily.
* `combinedProvider()` - Creates a `#!kotlin Provider<List<T>>` from a list of `#!kotlin Provider<T>`s.

## Config extraction
Nova will automatically extract all configs from `resources/configs/` on startup.
New or changed keys will automatically be added / updated on the server as well, unless they have been modified on the server.

## Accessing configs
To access the configs, retrieve them from `Configs`.  
You can either use their names:
```kotlin
Configs["example:ruby"] // namespace:name (drop the .yml)
```

Or retrieve the config of a `NovaItem` or `NovaBlock` using `#!kotlin NovaItem.config` and `#!kotlin NovaBlock.config`.

All of the above ways will result in you obtaining a config provider, which is a
`#!kotlin Provider<CommentedConfigurationNode>`. (Note that Configurate does not have support for yaml comments yet, 
but this should not be an issue unless you need to write to the config file.)  
Now, you can either retrieve the raw config node using `#!kotlin provider.get()`, or get a reloadable entry provider
using `#!kotlin provider.entry<Type>("path")` and `#!kotlin provider.optionalEntry<Type>("path")`.

```kotlin
val exampleValue1: Int by Items.EXAMPLE_ITEM.config.entry<Int>("example_value") // (1)!
val exampleValue2: Int? by Items.EXAMPLE_ITEM.config.optionalEntry<Int>("optional_value") // (2)!
```

1. Delegating to the `Provider<Int>` will cause this field automatically change every time the config is reloaded.
2. Using `Provider<ConfigurationNode>#optionalEntry`, you can get a `Provider<Int?>`, where the value is null if the key
   is not present in the config.