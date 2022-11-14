# Registering Materials

## Time and Place of Registration

The registration is pretty similar to the [item registration](../items/registering-materials.md). Create
the [block assets](../asset-packs/creating-blocks.md)
and create a `Blocks` singleton object that contains all `BlockNovaMaterials` of your addon. All materials need to be
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

}
```

Again, calling the init function will cause the class and all its fields to be loaded.

## BlockOptions

Before registering a new Block, you need to create a `BlockOptions` instance. This class contains properties for
breaking/placing custom blocks. Let's create an instance that can be broken with a stone pickaxe:

```kotlin
private val STONE = BlockOptions(
    3.0, // (1)!
    listOf(ToolCategory.PICKAXE), // (2)!
    ToolLevel.STONE, // (3)!
    true, // (4)!
    SoundGroup.STONE, // (5)!
    Material.NETHERITE_BLOCK, // (6)!
    true // (7)!
)
```

1. This is the hardness of the block. It determines how long it takes to break the block. This value currently doesn't affect explosions.
2. A list of tool categories that are suitable to break this block. Can be empty.
3. The minimum ``ToolLevel`` that is required to properly break this block (Like diamond for obsidian). Can be null.
4. Whether a tool is required to receive drops.
5. The sound group to use for this block. Sound groups include sounds for hitting, breaking and placing a block as well as
   stepping and falling on a block. You can also create your own sound group with your own custom sounds.
6. The break particles that spawn when the block is broken.
7. Whether a break animation should be displayed while breaking the block.

## Registering the block

Using the options specified above, you can now register your block material via `NovaMaterialRegistry#registerBlock` or
`NovaMaterialRegistry#registerTileEntity`:  

```kotlin
// normal block
val MY_BLOCK = NovaMaterialRegistry.registerBlock(ExampleAddon, "example_block", STONE)

// normal directional block (North, East, South, West)
val MY_BLOCK_1 = NovaMaterialRegistry.registerBlock(ExampleAddon, "example_block_1", STONE, properties = listOf(Directional.NORMAL))

// normal directional block (North, East, South, West, Up, Down)
val MY_BLOCK_2 = NovaMaterialRegistry.registerBlock(ExampleAddon, "example_block_2", STONE, properties = listOf(Directional.ALL))

// directional tile entity block (North, East, South, West)
val MY_TILE_ENTITY_1 = NovaMaterialRegistry.registerTileEntity(ExampleAddon, "example_tile_entity", STONE, ::ExampleTileEntity, properties = listOf(Directional.NORMAL))
```

!!! tip

    The examples above are far from everything you can do, as it is also possible to set a custom `NovaBlock`,
    `NovaItem`, `PlaceCheckFun` or `MultiBlockLoader`.

## Additional properties

### NovaBlock

The `NovaBlock` handles the logic of all blocks of that material (or multiple materials, if the same `NovaBlock` is
registered to them). This logic includes handling interacts, returning drops, playing the break sound, showing break
particles and more. Depending on if you register a TileEntity or a normal block, the `TileEntityBlock` or
`NovaBlock$Default` is used.

!!! info

    `NovaBlock` is very similar to `NovaItem` in concept, with the exception of it being for blocks and it's ability
    to be used in multiple materials.

### Block properties

Block properties store data stored inside the `NovaBlockState`.  
Currently, the only block property available is `Directional`, but addons can create custom block properties.  
Block properties can be accessed by calling the `getProperty(BlockPropertyType)` or `getProperty(KClass)` methods in  
`NovaBlockState`.

### MultiBlockLoader

The `MultiBlockLoader` is a typealias for `(BlockPos) -> List<BlockPos>` which is just supposed to return a list of
block positions that are also part of this block. This list should not include the position of the base block.

### PlaceCheckFun

The `PlaceCheckFun` is a typealias for `((Player, ItemStack, Location) -> CompletableFuture<Boolean>)` used to check
for placement permissions of multi blocks.