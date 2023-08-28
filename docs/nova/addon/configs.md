# Configs

## Configuration Library
Nova uses a modified version of [SpongePowered/Configurate](https://github.com/SpongePowered/Configurate), but most of the
time you'll be dealing with Nova's `ConfigProvider`, which helps you with config reloading.

## Provider

To help with config reloading, Nova offers the `Provider` class. This class stores a value of a given type and can be
delegated to. `Providers` have an abstract `loadValue` function that, depending on its implementation, might load something
from a config, a CBF `Compound`, or anything else.  
ConfigProviders are automatically reloaded when the config is reloaded. You can also chain value modification calls on a `Provider`. Those modification steps will then be run every time the
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

## Adding configs to your addon
In order to add configs to your addon, create a directory called `configs` in `resources`. There, you can add all
your .yml configs, which will automatically be extracted on startup.  
New or changed keys will automatically be added / updated on the server as well, unless they have been modified by an admin.

## Accessing configs
To access the configs, retrieve them from `Configs`.  
You can either use their names:
```kotlin
Configs["example:ruby"] // namespace:name (drop the .yml)
```
```kotlin
Configs[ResourceLocation("example:ruby")]
```

Or retrieve the config of a `NovaItem` or `NovaBlock` using `NovaItem#config` and `NovaBlock#config`.

All of the above ways will result in you obtaining a `ConfigProvider`, which is a `Provider<CommentedConfigurationNode>`.
Now, you can either retrieve the raw config node using `Provider#value`, or get a reloadable entry provider using
`ConfigProvider#entry` and `ConfigProvider#optionalEntry`.

```kotlin
val exampleValue: Int by Configs[Items.RUBY].entry<Int>("example_value") // (1)!
val otherValue: Int? by Configs[Items.RUBY].optionalEntry<Int>("other_value") // (2)!
```

1. Delegating to the `Provider<Int>` will cause this field automatically change every time the config is reloaded.
2. Using `ConfigProvider#optionalEntry`, you can get a `Provider<Int?>`, where the value is null if the key is not present
   in the config.