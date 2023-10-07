## Creating a Block Registry

Create a `BlockRegistry` singleton object and annotate it with `#!kotlin @Init` to have it loaded during addon initialization.

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Blocks : BlockRegistry by ExampleAddon.registry {
    
    // (2)!
    
}
```

1. Nova will load this class during addon initialization, causing your blocks to be registered.
2. Register your blocks here

## BlockOptions

Before registering a new Block, you need to create a `BlockOptions` instance. This class contains properties for
breaking/placing custom blocks. Let's create an instance that can be broken with a stone pickaxe:

```kotlin
private val STONE = BlockOptions(
    3.0, // (1)!
    VanillaToolCategories.PICKAXE, // (2)!
    VanillaToolTiers.STONE, // (3)!
    true, // (4)!
    SoundGroup.STONE, // (5)!
    Material.NETHERITE_BLOCK // (6)!
)
```

1. This is the hardness of the block. It determines how long it takes to break the block. This value currently doesn't affect explosions.
2. A list of tool categories that are suitable to break this block. Can be empty.
3. The minimum `ToolTier` that is required to properly break this block (Like diamond for obsidian). Can be null.
4. Whether a tool is required to receive drops.
5. The sound group to use for this block. Sound groups include sounds for hitting, breaking and placing a block as well as
   stepping and falling on a block. You can also create your own sound group with your own custom sounds.
6. The break particles that spawn when the block is broken. This is only relevant for armor stand based blocks, but since
   you can't know if your block will end up being and armor stand block, you'll always have to set this value.

## Registering the block

Using the options specified above, you can now register your block material via the builders obtained by calling
`BlockRegistry#block` or `BlockRegistry#tileEntity`. Unlike items, block- and tile-entities
can only be registered using the builder functions.

```kotlin
// normal block
val MY_BLOCK = block("example_block").blockOptions(STONE).register()

// normal directional block (North, East, South, West)
val MY_BLOCK_1 = block("example_block").blockOptions(STONE).properties(Directional.NORMAL).register()

// normal directional block (North, East, South, West, Up, Down)
val MY_BLOCK_2 = block("example_block").blockOptions(STONE).properties(Directional.ALL).register()

// directional tile entity block (North, East, South, West)
val MY_TILE_ENTITY_1 = tileEntity("example_block", ::ExampleTileEntity).blockOptions(STONE).properties(Directional.NORMAL).register()
```

!!! bug "Don't forget to call `register()` at the end of the builder chain."

## Additional properties

### BlockBehavior

The `BlockBehavior` handles the logic of all blocks of that material (or multiple materials, if the same `BlockBehavior` is
registered to them). This logic includes handling interacts, returning drops, playing the break sound, showing break
particles and more. Depending on if you register a TileEntity or a normal block, the `TileEntityBlockBehavior` or
`BlockBehavior$Default` is used.

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

## Registering the block item

After you've registered your block, you will also need to register the item for it:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items : ItemRegistry by ExampleAddon.registry {
    
    /* ... your other items ... */
    
    val MY_BLOCK = registerItem(Blocks.MY_BLOCK)
    
}
```