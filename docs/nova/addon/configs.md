---
icon: lucide/file-cog
---

# Configs

Nova uses YAML as its configuration format, reading it via [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization).

!!! info "Configs are read as JSON"

    Nova converts YAML to JSON internally, then uses `kotlinx.serialization` for deserialization. This is because `kotlinx.serialization` does not support YAML natively. Additionally, this allows you to use JSON-specific serializers like `JsonTransformingSerializer`. The config files themselves stay in YAML format.

## Config Extraction

Nova will automatically extract all YAML files from `resources/configs/` on startup to `plugins/<addon name>/configs/<name>.yml`, preserving the capitalization of the addon name. New or changed keys will automatically be added / updated on the server as well, unless they have been modified on the server.

## Accessing Configs

You can access a config in two ways:

1. `#!kotlin CONFIGS["<namespace>:<name>"]`:
    - `plugins/<addon name>/configs/<name>.yml` (extracted from `resources/configs/<name>.yml`)
2. `#!kotlin ItemType.config` / `#!kotlin BlockType.config`:
    - By default, this is the same as `#!kotlin CONFIGS["<namespace>:<name>"]`, but a custom config path can be set in the item/block builder.

Ultimately, the type you'll get is `ConfigProvider`[^1], which is a [`Provider<JsonElement>`](providers.md) with additional functions like `entry` and `optionalEntry` that you can use like this:

[^1]: Or `#!kotlin Provider<ConfigProvider>` if you got it from e.g. `#!kotlin ItemType.config`, because [registry reloading](registries.md#registry-reloading) could change the config path. This should not matter to you though, since there are equivalent extension functions for `Provider<ConfigProvider>`.

```kotlin
val exampleValue1: Int by Items.EXAMPLE_ITEM.config.entry<Int>(1, "example_value") // (1)!
val exampleValue2: Int? by Items.EXAMPLE_ITEM.config.optionalEntry<Int>("optional_value") // (2)!
```

1. Delegating to the `Provider<Int>` will cause this field automatically change every time the config is reloaded.
2. Using `ConfigProvider#optionalEntry`, you can get a `Provider<Int?>`, where the value is null if the key is not present in the config.

## Built-In Serializers

Nova offers lots of built-in serializers under `xyz.xenondevs.nova.serialization.kotlinx`. Most notably, this covers all registry-related types such as `ItemType`, `#!kotlin RegistryEntry.Paper<ItemType>`, `#!kotlin RegistryEntrySet.Paper<ItemType>`, and more.

!!! tip "Prefer Nova's registry types"

    Prefer using Nova's `#!kotlin RegistryEntry.Paper<T>` over `T` and `#!kotlin RegistryEntrySet.Paper<T>` over `#!kotlin RegistryKeySet<T>`. Nova's types can be deserialized during bootstrap phase, Paper's types cannot.

Nova also ships with [serializable type aliases](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md#specifying-a-serializer-globally-using-a-typealias) to reduce verbosity:

```kotlin
@Serializable
data class ItemsMenuTab(
   val icon: ItemTypeEntry /*(1)!*/ = ItemTypeEntries.AIR,
   val name: ComponentAsMiniMessage /*(2)!*/  = Component.empty(),
   val description: ValueOrList<ComponentAsMiniMessage> /*(3)!*/  = emptyList(),
   val items: ItemTypeEntrySet /*(4)!*/  = emptyRegistryEntrySet(RegistryKey.ITEM)
)
```

1. `#!kotlin @Serializable(ItemTypeEntrySerializer::class) RegistryEntry.Paper<ItemType>`
2. `#!kotlin @Serializable(ComponentAsMiniMessageSerializer::class) Component`
3. `#!kotlin @Serializable(ValueOrListSerializer::class) List<@Serializable(ComponentAsMiniMessageSerializer::class) Component>`
4. `#!kotlin @Serializable(ItemTypeEntrySetSerializer::class) RegistryEntrySet.Paper<ItemType>`

## Custom Serializers

Nova's config system uses [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization), so every `#!kotlin @Serializable` can immediately be used as a config value. You can also register additional serializers `SerializersModule` via `#!kotlin CONFIGS.setSerializers(addon, serializersModule)`.

!!! warning "Limitations of `SerializersModules`"

     Due to the nature of `kotlinx.serialization`, your custom serializers are only queried for the immediate type requested by `#!kotlin ConfigProvider.entry<T>(...)` (or for properties annotated with `#!kotlin @Contextual`). For serializable classes, prefer annotating the relevant properties with `@Serializable(with = SerializerClass::class)` directly instead of relying on the `SerializersModule` to provide the serializer (see code example above).
