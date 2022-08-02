## Creating a basic TileEntity class

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