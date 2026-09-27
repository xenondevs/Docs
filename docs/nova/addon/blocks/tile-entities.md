---
icon: lucide/scan-box
---

# Tile Entities

Tile-Entities are blocks that have additional data and logic attached to them.

## Creating a Tile-Entity

Before registering the block for a tile-entity, you'll need to create a class that extends `TileEntity`:

```kotlin
class ExampleTileEntity(
    block: Block,
    blockState: NovaBlockState,
    data: Compound
) : TileEntity(block, blockState, data) {

    // ...

}
```

Now, you can register the block:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Blocks {
    
    val EXAMPLE_TILE_ENTITY = ExampleAddon.tileEntity("example_tile_entity", ::ExampleTileEntity) {
        behaviors(
            TileEntityDrops, // (2)!
            TileEntityInteractive // (3)!
        )
        tickrate(20) // (4)!
    }
    
}
```

1. Nova will load this class during addon initialization, causing your blocks to be registered.
2. Delegates the drop logic to `#!kotlin TileEntity.getDrops`.
3. Delegates interactions to `#!kotlin TileEntity.use` and `#!kotlin TileEntity.useItemOn`. This is also required if your tile-entity has a [GUI](../guis/tile-entity-menu.md).
4. The rate at which `#!kotlin TileEntity.handleTick` function is called. This defaults to `20`, so you wouldn't need to specify it in this case.

[Tile-entity limits](../../admin/configuration.md#tile-entity-limits) are enabled automatically.

!!! danger "Tile-Entities are instantiated off-main"

    Tile-Entities are constructed off-main, so you cannot interact with world state during object construction.  
    Also, it is not guaranteed that the chunk the tile-entity is in is loaded at the time of construction. For such cases, use `#!kotlin TileEntity.handleEnable()` and `#!kotlin TileEntity.handleDisable()`.
    
    Additionally, especially concerning tile-entites that are in spawn chunks, Nova might not be fully initialized when the tile-entity is constructed. As such, you cannot rely on anything that is not initialized pre world to be available during tile-entity construction. (Such as RecipeManager for example, which needs to wait for the initialization of supported third-party custom item plugins.)

## Accessing Tile-Entity data

Tile-Entity data is stored in our CBF Format, so make sure to check out the [CBF Documentation](../../../../cbf).

??? example "Default Nova Binary Adapters"

    Nova provides binary serializers for types such as `Color`, `Location`, `NamespacedKey`, `Key`, `VirtualInventory`, `#!kotlin Block`, `ItemStack`, `Table`, `ItemFilter`, and the face/side map and set types. It also registers serializers for entries and values of built-in Paper and Nova registries.

    You can register binary adapters for your own types as explained in the CBF Documentation.  
    If you require a binary adapter for a type from Java / Minecraft / Paper, please request it on GitHub.

To access tile-entity data, you can use the `storedValue` function to retrieve a `#!kotlin MutableProvider<T>` to which you can delegate:

```kotlin title="storedValue (not null)"
private val someInt: Int by storedValue("someInt") { 0 }
```

```kotlin title="storedValue (nullable)"
private val someString: String? by storedValue("someString")
```

And that's it! When the tile-entity gets saved, those properties will automatically be saved with it.

!!! note "Providers are lazy"

    Since Providers are lazy, it is safe to use them to access things that are initialized post world, as long as their values are not resolved immediately.

Alternatively, you can also use `retrieveData` and `storeData` functions to manually read and write data. For that, you may also want to override the `saveData` function.

### Utility functions for commonly stored data types

There are a few utility functions available in `TileEntity` for storing commonly used data:

* `storedInventory` - Creates or reads a [VirtualInventory](../../../../invui/inventory/#virtual-inventory) from internal storage. Also registers a drop provider that drops the inventory's contents when the tile-entity is destroyed.
* `storedFluidContainer` - Creates or reads a `FluidContainer` from internal storage.
* `storedRegion` - Creates or reads a [DynamicRegion](../regions.md#dynamic-region) from internal storage.
