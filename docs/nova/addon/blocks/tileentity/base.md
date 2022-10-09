# Creating a basic TileEntity class

Before registering the material, you need to create a TileEntity class with a constructor that takes a `NovaTileEntityState` instance.
We will reference this constructor in the ``registerTileEntity`` function later.

```kotlin
class SolarPanel(blockState: NovaTileEntityState) : NetworkedTileEntity(blockState) {
    
    override val gui: Lazy<TileEntityGUI>
        get() = TODO("We'll implement this later")

}
```

Don't worry about the ``gui`` property or ``NetworkedTileEntity`` yet. Now we can finally register the material.

```kotlin
val SOLAR_PANEL = registerTileEntity(ExampleAddon, "solar_panel", STONE, ::SolarPanel)
```

So your ``Blocks`` object might look something like this:

```kotlin
object Blocks {
    
    private val STONE = BlockOptions(3.0, ToolCategory.PICKAXE, ToolLevel.STONE, true, Material.BARRIER, SoundEffect(Sound.BLOCK_STONE_PLACE), SoundEffect(Sound.BLOCK_STONE_BREAK), Material.NETHERITE_BLOCK)
    
    val SOLAR_PANEL = registerTileEntity(ExampleAddon, "solar_panel", STONE, ::SolarPanel)
    
    fun init() = Unit

}
```

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
* ``createParticleTask()`` - See [Particles](particles.md).
* ``createSideConfig()``, ``createExclusiveSideConfig()`` - See [Holders](holders.md).
* ``getBlockFrontRegion()``, ``getFrontRegion()``, ``getSurroundingRegion()`` - See [Region](region.md)
* ``createStaticRegion()``, ``getDynamicRegion()``, ``getUpgradableRegion()`` - See [Reloadable Region](region.md#reloadableregion)
* ``playSoundEffect()`` - Plays a sound effect to all TileEntity viewers.
* ``getViewers()`` - Returns a list of all players that the TileEntity is visible to.