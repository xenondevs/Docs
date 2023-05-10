# Creating a basic TileEntity class

Before registering the material, you need to create a TileEntity class with a constructor that takes a `NovaTileEntityState` instance.

```kotlin
class SolarPanel(blockState: NovaTileEntityState) : NetworkedTileEntity(blockState) {

}
```

Now, we can register the material:

```kotlin
val SOLAR_PANEL = NovaMaterialRegistry.tileEntity(ExampleAddon, "solar_panel", ::SolarPanel).blockOptions(STONE).register()
```

So your ``Blocks`` object might look something like this:

```kotlin
@Init // (1)!
object Blocks : BlockRegistry by ExampleAddon.registry {
    
    private val STONE = BlockOptions(3.0, ToolCategory.PICKAXE, ToolTier.WOOD, true, SoundGroup.STONE, Material.NETHERITE_BLOCK)
    
    val SOLAR_PANEL = tileEntity(ExampleAddon, "solar_panel", ::SolarPanel).blockOptions(STONE).register()
    
}
```

1. Nova will load this class during addon initialization, causing your blocks to be registered.

## NetworkedTileEntity

A default ``TileEntity`` can't be connected to networks, but a ``NetworkedTileEntity`` can. So if your TileEntity should
be able to properly interact with surrounding blocks and cables, use ``NetworkedTileEntity``.

## Overriding commonly needed functions

!!! note

    Some of these functions are only available via the ``NetworkedTileEntity`` class.

### ``handleTick()``

This function is called every tick in the server thread.

```kotlin
override fun handleTick() {
    // Called every tick
}
```

### ``handleAsyncTick()``

This function is called every tick asynchronously.

```kotlin
override fun handleAsyncTick() {
    // Called every tick
}
```

### ``handleInitialized(first: Boolean)``

Called when the TileEntity is loaded/placed. The ``first`` parameter is true when the TileEntity is first loaded meaning
it has just been placed. Make sure to call the superclass's function.

```kotlin
override fun handleInitialized(first: Boolean) {
    super.handleInitialized(first)
    // Called when the TileEntity is loaded/placed
}
```

### ``handleRemoved(unload: Boolean)``

Called after the TileEntity has been removed from the TileEntityManager's TileEntity map because it either got unloaded 
or destroyed. The ``unload`` parameter is true when the TileEntity was removed because the chunk was unloaded. Make sure 
to call the superclass's function.

```kotlin
override fun handleRemoved(unload: Boolean) {
    super.handleRemoved(unload)
    // Called when the TileEntity is unloaded/broken
}
```

### ``handleRightClick(ctx: BlockInteractContext): Boolean``

This function is called when a player right-clicks the block. The return value determines whether any action was performed.
Make sure to call the superclass's function.

```kotlin
override fun handleRightClick(ctx: BlockInteractContext): Boolean {
    actionPerformed = super.handleRightClick(ctx)
    // Called when a player right-clicks the block
    return actionPerformed // || ...
}
```

### ``reload()``

This function is called when a TileEntity's upgrades are changed or when the config is reloaded. Make sure to call the 
superclass's function

```kotlin
override fun reload() {
    super.reload()
    // do your own reloading here
}
```

### ``getDrops(includeSelf: Boolean): MutableList<ItemStack>``

Override this function if you need to add additional drops. You can ignore the ``includeSelf`` parameter as it is only
needed by the superclass's function.

```kotlin
override fun getDrops(includeSelf: Boolean): MutableList<ItemStack> {
    val list = super.getDrops(includeSelf)
    // add your own drops here
    return list
}
```

### ``saveData()``

Use this function to save any additional data your TileEntity might have. You can store the data via ``storeData`` which
will serialize the data via CBF. Make sure to call the superclass's function. Read the [TileEntity Data Page](data.md) for
more information.

```kotlin
override fun saveData() {
    super.saveData()
    // save your data here
    // e.g. storeData("pressTime", timeLeft)
}
```

## Other useful functions

* ``getInventory()`` - See [ItemHolders](holders.md#itemholder).
* ``getFluidContainer()`` - See [FluidHolders](holders.md#fluidholder).
* ``createPacketTask()`` - Repeatedly sends the same packets to all players in range. See [Particles](particles.md).
* ``createSideConfig()``, ``createExclusiveSideConfig()`` - See [Holders](holders.md).
* ``getBlockFrontRegion()``, ``getFrontRegion()``, ``getSurroundingRegion()`` - See [Region](region.md)
* ``createStaticRegion()``, ``getDynamicRegion()``, ``getUpgradableRegion()`` - See [Reloadable Region](region.md#reloadableregion)
* ``playSoundEffect()`` - Plays a sound effect to all TileEntity viewers.
* ``getViewers()`` - Returns a list of all players that the TileEntity is visible to.