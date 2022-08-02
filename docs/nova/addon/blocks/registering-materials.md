# Registering Materials

## Time and Place of Registration

The registration is pretty similar to the [item registration](../items/registering-materials.md). Create
the [block assets](../asset-packs/creating-blocks.md)
and create a `Blocks` singleton object that contains all `BlockNovaMaterial` of your addon. All materials need to be
registered when `Addon#init` is called, materials registered later won't work properly. Similar to the `Items` singleton
object, your singleton object might then look like this:

```kotlin
object Blocks {
    
    // we will register blocks here later
    
    fun init() = Unit

}
```

Now add the init call to your main class:

```kotlin
object ExampleAddon : Addon() {
    
    override fun init() {
        Items.init()
        Blocks.init()
    }
    
    override fun onEnable() = Unit
    override fun onDisable() = Unit

}
```

Again, calling the init function will cause the class and all its fields to be loaded.

## BlockOptions

Before registering a new TileEntity, you need to create a `BlockOptions` instance. This class contains properties for
breaking/placing custom blocks. Let's create an instance that can be broken with a stone pickaxe:

```kotlin
private val STONE = BlockOptions(
    3.0, // (1)
    ToolCategory.PICKAXE, // (2)
    ToolLevel.STONE, // (3)
    true, // (4)
    SoundEffect(Sound.BLOCK_STONE_PLACE), // (6)
    SoundEffect(Sound.BLOCK_STONE_BREAK), // (7)
    Material.NETHERITE_BLOCK, // (8)
    true // (9)
)
```

1. This is the hardness of the block. It determines how long it takes to break the block. This value currently doesn't affect explosions.
2. The type of tool that can break this block.
3. The minimum ``ToolLevel`` that is required to properly break this block (Like diamond for obsidian).
4. Whether a tool is required to receive drops.
5. The sound that plays when the block is placed.
6. The sound that plays when the block is broken.
7. The break particles that spawn when the block is broken.
8. (optional) Whether a break animation should be displayed while breaking the block.

## NovaBlock

The `NovaBlock` handles the logic of all blocks of that material (or multiple materials, if the same `NovaBlock` is
registered to them). This logic includes handling interacts, returning drops, playing the break sound or break particles
and more. Depending on if you register a TileEntity or a normal block, the `TileEntityBlock` or `NovaBlock$Default` is used.

!!! info

    `NovaBlock` is very similar to `NovaItem` in concept, with the exception of it being for blocks and it's ability
    to be used in multiple materials.

## Block properties

Block properties store data stored inside the `NovaBlockState`.  
Currently, the only block property available is `Directional`, but addons can create custom block properties.  
Block properties can be accessed by calling the `getProperty(BlockPropertyType)` or `getProperty(KClass)` methods in  
`NovaBlockState`.

# PlaceCheckFun

The `PlaceCheckFun` is a typealias for `((Player, ItemStack, Location) -> CompletableFuture<Boolean>)` can be used
for additional permission checks for block placing. This might be useful for checking the place permission for blocks
with multiple hitboxes.

# MultiBlockLoader

The `MultiBlockLoader` is a typealias for `(BlockPos) -> List<BlockPos>` which is just supposed to return a list of
block positions that are also part of this block. This list should not include the position of the base block.

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