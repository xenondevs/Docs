---
icon: lucide/list-tree
---

# Registries

## What are Registries?

Minecraft stores a lot of its data in registries, such as item types, block types, entity types, etc. Paper exposes these as `org.bukkit.Registry`. Since Paper does not allow the creation of additional registries, Nova also introduces its own `NovaRegistry` type, which is used for additional things like `GuiTexture`.

You can think of registries as a `Map<Key, V>` where `Key` is a namespaced identifier like `minecraft:stone` and `V` the corresponding item- or block type.

## Registry Entries

_(If you're familiar with Minecraft's internals, think: `#!kotlin Holder.Reference<T>`)_

Nova introduces the `#!kotlin RegistryEntry<T>` type, which represents an entry in a registry that may not exist yet but will definitely exist after startup.

This is useful as it allows you to wire things together without having to worry about initialization order or circular dependencies. For example, you can create an item for a block via `#!kotlin Addon.item(block: RegistryEntry.Paper<BlockType>)` during initialization, even though the `BlockType` does not exist yet.

`#!kotlin RegistryEntry<T>` is also a [Provider](providers.md), which allows you to chain lazy transformations. It will also automatically update on [registry reload](registries.md#registry-reloading).

!!! tip "Nova has pre-defined registry entries for all vanilla types. You can find them in appropriately named singleton objects like `ItemTypeEntries` or `BlockTypeEntries`."

## Registry Entry Sets

_(If you're familiar with Minecraft's internals, think: `#!kotlin HolderSet<T>`)_

Nova also introduces the `#!kotlin RegistryEntrySet<T>` type, which represents a set of registry entries. This can either be a direct set of entries or a tag. Like `RegistryEntry<T>`, the tag does not need to exist yet, but Nova guarantees its existence after startup.

`#!kotlin RegistryEntrySet<T>` is also a [Provider](providers.md), which allows you to chain lazy transformations. It will also automatically update when the underlying tag changes.

You can create registry entry sets via `registryEntrySetOf`:

```kotlin
val set = registryEntrySetOf(ItemTypeEntries.COBBLESTONE, ItemTypeEntries.STONE)
```

!!! tip "Nova has pre-defined registry entry sets for all vanilla tags. You can find them in appropriately named singleton objects like `ItemTypeTags` or `BlockTypeTags`."

## Creating and editing Tags

You can create and edit tags via the `...Tag` functions on your addon object:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items {
    
    val ITEM_A = ExampleAddon.item("a") {}
    val ITEM_B = ExampleAddon.item("b") {}
    
    // Creates a custom tag named #example_addon:my_tag containing ITEM_A and ITEM_B
    val MY_TAG = ExampleAddon.itemTag("my_tag") {
        add(ITEM_A)
        add(ITEM_B)
    }
    
    init {
        // Adds ITEM_A and ITEM_B to the existing #minecraft:dirt tag
        ExampleAddon.itemTag(ItemTypeTags.DIRT) {
            add(ITEM_A)
            add(ITEM_B)
        }
    }
    
}
```

Tag sources can also be reactive:

```kotlin
// Creates a custom tag named #example_addon:my_tag that reads its contents
// from tag_sources.yml and supports config reloading.
val MY_TAG = ExampleAddon.itemTag("my_tag") {
    add(CONFIGS["example_addon:tag_sources"].entry(emptyList(), "my_tag"))
}
```

You can also specify tag membership the other way around. Use the `tags` function to declare membership directly in the builder of a registry element:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items {
    
    // Creates ITEM_A and ITEM_B, both of which are in #example_addon:my_tag and #minecraft:dirt
    val ITEM_A = ExampleAddon.item("a") { tags(MY_TAG, ItemTypeTags.DIRT) }
    val ITEM_B = ExampleAddon.item("b") { tags(MY_TAG, ItemTypeTags.DIRT) }
    
    // Creates a custom tag named #example_addon:my_tag
    val MY_TAG = ExampleAddon.itemTag("my_tag") {}
    
}
```

You can also declare tag membership through `#!kotlin ItemBehavior` and `#!kotlin BlockBehavior`:

```kotlin
class MyBehavior : ItemBehavior {
    override val tags = provider(setOf(Items.MY_TAG))
}
```

## Registry Reloading

Many registries can be reloaded at runtime to help you speed up development. Reloading re-runs the registered builder functions. Registry reloading can be triggered manually via `/nova reload registry <registry>`, but it also happens automatically when a hot-swap is detected.

Vanilla Registries like the item- or block registries cannot be reloaded by themselves. However, Nova can still re-run the builder lambda and update certain parts of the object. Some aspects of these elements still require a full restart, but you can use it to change out item- & block behaviors, data components, etc.

??? example "Changing an Item's lore via registry reloading"

    `ItemType` is registered in a vanilla registry that is not reloadable, so reloading does not create a new `ItemType` instance. This also means that the `RegistryEntry.Paper<ItemType>` is NOT re-bound and NO update is propagated. However, inventories are refreshed post-reload, so we can still see the change here:

    ![](../assets/img/addon/registry/reload-item.avif)

`NovaRegistry` supports reloading natively. Reloading a `NovaRegistry` creates a completely new element instance. The `#!kotlin RegistryEntry.Nova<T>` is re-bound to point to the new value.

??? example "Changing a GUI Texture via Registry Reloading"
    `GuiTextures` are registered in a `NovaRegistry`, so reloading creates a new `GuiTexture` instance. Since the `RegistryEntry.Nova<GuiTexture>` is a [Provider](providers.md), we can wire it to InvUI's window title, which makes it refresh automatically when the registry is reloaded:
    
    ![](../assets/img/addon/registry/reload-guitexture.avif)

!!! note "Full registry reloading vs. Simple re-running"

    `NovaRegistry` supports full reloading, creating new element instances per reload. The `#!kotlin RegistryEntry.Nova<T>` is re-bound, reactively updating its children.  
    Vanilla registries like the item- or block registry do not, the `ItemType` and `BlockType` instances stay the same. The `#!kotlin RegistryEntry.Paper<T>` is NOT re-bound and no update is propagated.

## Custom Nova Registries

You can also create your own `NovaRegistry`, corresponding builders, and hook into Nova's registry reloading system.

First, create the type to be stored in the registry. This must implement `NovaRegistryElement`:

```kotlin
class MyElement internal constructor(
    override val entry: RegistryEntry.Nova<MyElement>,
    val someData: String
) : NovaRegistryElement<MyElement>
```

Then, create the corresponding registry:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object MyElements {
    internal val registry = ExampleAddon.registry<MyElement>("my_element")
}
```

Then, create the corresponding builder interface and implementation:

```kotlin
sealed interface MyElementBuilder {
    fun someData(data: String)
}
```

```kotlin
private class MyElementBuilderImpl(
    override val entry: RegistryEntry.Nova<MyElement>,
) : MyElementBuilder, RegistryElementBuilder.Nova<MyElement> {
    
    override val tags: Provider<Set<RegistryEntrySet.Nova.Tag<MyElement>>>
        field = mutableProvider<Set<RegistryEntrySet.Nova.Tag<MyElement>>>(emptySet())
    private var someData = ""
    
    override fun tags(vararg tags: RegistryEntrySet.Nova.Tag<MyElement>) {
        this.tags.set(this.tags.get() + tags)
    }
    
    override fun someData(data: String) {
        someData = data
    }
    
    override fun build() = MyElement(entry, someData)
    
}
```

Finally, add an extension function on `Registrar` that calls `RegistryLoader.enqueueNova` to register the element:

```kotlin
fun Registrar.myElement(name: String, myElement: MyElementBuilder.() -> Unit): RegistryEntry.Nova<MyElement> =
    RegistryLoader.enqueueNova(MyElements.registry, key(namespace(), name), ::MyElementBuilderImpl, myElement)
```

Now, you can register your custom elements with the same syntax as for Nova's built-in registries. Registry reloading will also work automatically.

```kotlin
@Init(stage = InitStage.PRE_PACK)
object MyElements {
    
    internal val registry = ExampleAddon.registry<MyElement>("my_element")
    
    val EXAMPLE_ELEMENT = ExampleAddon.myElement("example_element") {
        someData("This is an example element")
    }
    
}
```
