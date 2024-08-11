Tile-Entities are blocks that have additional data and logic attached to them.

## Creating a Tile-Entity

Before registering the `NovaBlock` for a tile-entity, you'll need to create a class that extends `TileEntity`:

```kotlin
class ExampleTileEntity(
    pos: BlockPos,
    blockState: NovaBlockState,
    data: Compound
) : TileEntity(pos, blockState, data) {

    // ...

}
```

Now, you can register the block:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Blocks : BlockRegistry by ExampleAddon.registry {
    
    val EXAMPLE_TILE_ENTITY = tileEntity("example_tile_entity", ::ExampleTileEntity) {
        behaviors(
            TileEntityLimited, // (2)!
            TileEntityDrops, // (3)!
            TileEntityInteractive // (4)!
        )
        tickrate(20) // (5)!
    }
    
}
```

1. Nova will load this class during addon initialization, causing your blocks to be registered.
2. Enables [tile-entity limits](../../admin/configuration.md#tile-entity-limits).
   (Note that if this behavior is not present, tile-entity limit tracking will also be disabled and placing this tile-entity
   will not count towards global limits.)
3. Delegates the drop logic to `#!kotlin TileEntity.getDrops`.
4. Delegates interactions to `#!kotlin TileEntity.handleRightClick`. This is also required if your tile-entity has a [GUI](gui.md).
5. The rate at which `#!kotlin TileEntity.handleTick` function is called.
   This defaults to `20`, so you wouldn't need to specify it in this case.

!!! danger "Tile-Entities are instantiated off-main"

    Tile-Entities are constructed off-main, so you cannot interact with world state during object construction.  
    Also, it is not guaranteed that the chunk the tile-entity is in is loaded at the time of construction.
    For such cases, use `#!kotlin TileEntity.handleEnable()` and `#!kotlin TileEntity.handleDisable()`.
    
    Additionally, especially concerning tile-entites that are in spawn chunks, Nova might not be fully initialized
    when the tile-entity is constructed. As such, you cannot rely on anything that is not initialized pre world to be
    available during tile-entity construction. (Such as RecipeManager for example, which needs to wait for the initialization
    of supported third-party custom item plugins.)

## Accessing Tile-Entity data

Tile-Entity data is stored in our CBF Format, so make sure to check out the [CBF Documentation](../../../../cbf).

??? example "Default Nova Binary Adapters"

    Nova provides binary adapters for the following types by default:  
    `NamespacedCompound`, `Color`, `Location`, `NamespacedKey`, `NamespacedId`, `ResourceLocation`, `VirtualInventory`,
    `BlockPos`, `ItemStack`, `NetworkType`, `AbilityType`, `AttachmentType`, `RecipeType`, `Table`, `ItemFilter`,
    `NovaBlock`, `NovaItem`, `ToolCategory`, `ToolTier`

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

!!! abstract "Providers are lazy"

    Since Providers are lazy, it is safe to use them to access things that are initialized post world, as long as
    their values are not resolved immediately.

Alternatively, you can also use `retrieveData` and `storeData` functions to manually read and write data.
For that, you may also want to override the `saveData` function.

### Utility functions for commonly stored data types

There are a few utility functions available in `TileEntity` for storing commonly used data:

* `storedInventory` - Creates or reads a [VirtualInventory](../../../../invui/inventory/#virtual-inventory)
  from internal storage. Also registers a drop provider that drops the inventory's contents when the tile-entity is
  destroyed.
* `storedFluidContainer` - Creates or reads a `FluidContainer` from internal storage.
* `storedRegion` - Creates or reads a [DynamicRegion](region.md#dynamic-region) from internal storage.