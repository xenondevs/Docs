Similar to [ItemBehaviors](../items/item-behaviors.md), you can implement block logic via `BlockBehavior`.

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks : BlockRegistry by ExampleAddon.registry {

   val EXAMPLE_BLOCK = block("example_block") {
       behaviors(/*...*/)
   }

}
```

## Default block behaviors

!!! example "Default block behaviors"

    === "Breakable"

        Allows the block to be broken in survival mode and is used to configure block-breaking related settings
        such as hardness, required tool type, etc.

        ```kotlin
        private val STONE_LIKE = Breakable(
            hardness = 3.0, // (1)!
            toolCategory = VanillaToolCategories.PICKAXE, // (2)!
            toolTier = VanillaToolTiers.STONE, // (3)!
            requiresToolForDrops = true, // (4)!
            brerakParticles = Material.STONE // (5)!
        )
        ```
        
        1. Determines how long it takes to break the block. This value currently doesn't affect explosions.
        2. The tool category that is suitable to break this block. There are also other constructors available
           that allow you to specify multiple or no tool categories.
        3. The minimum `ToolTier` that is required to properly break this block (Like diamond for obsidian). Optional.
        4. Whether the correct tool is required for drops.
        5. The break particles that spawn when the block is broken. This is only relevant for entity-backed blocks.

    === "BlockSounds"

        Adds sounds to your block. (Place / Break / Step / Hit / Fall)

    === "BlockDrops"

        Implements the default block drop logic that creates an `ItemStack` of the corresponding `NovaItem` when broken.
        If your block is a tile-entity, use `TileEntityDrops` instead.

    === "TileEntityDrops"

        A behavior for [tile-entities](../tile-entity/introduction.md) that delegates the drop logic
        to `#!kotlin TileEntity.getDrops`.

    === "TileEntityInteractive"

        A behavior for [tile-entities](../tile-entity/introduction.md) that delegates interactions
        to `#!kotlin TileEntity.handleRightClick`.

    === "TileEntityLimited"

        A behavior for [tile-entities](../tile-entity/introduction.md) that enables
        [tile-entity limits](../../admin/configuration.md#tile-entity-limits).

    === "Bucketable"

        Allows filling and emptying fluid containers of [tile-entities](../tile-entity/introduction.md) that
        are [networked](../tile-entity-networks/introduction.md) and have a
        [fluid holder](../tile-entity-networks/introduction.md#default-network-types) with buckets.


## Custom Block Behavior

To create a custom block behavior, you just need to implement the `BlockBehavior` interface and override the desired
event methods.

### Random ticks

To receive random ticks in your block behavior, make sure to also override `#!kotlin BlockBehavior.ticksRandomly`
which is used to define what block states can receive random ticks.

Every tick, every chunk section (16x16x16 blocks) will have `random-tick-speed` blocks chosen randomly to receive a
random tick.
