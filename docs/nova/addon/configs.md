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
Or if the name matches the name of one of your [items](items/registering-materials.md), the NovaMaterial:
```kotlin
NovaConfig[Items.RUBY]
```

## configReloadable
In order to take advantage of the config reloading feature, delegate properties to `configReloadble`:

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