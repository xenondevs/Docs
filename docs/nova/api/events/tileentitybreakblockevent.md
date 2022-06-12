# TileEntityBreakBlockEvent

The ``TileEntityBreakBlockEvent`` is called when a tile-entity breaks a block. It can be used to manipulate the drops of 
the broken block.

!!! warning

    This event can't be cancelled. Please see [ProtectionIntegration](../protection/protectionintegration.md).

## Properties

### tileEntity

The ``TileEntity`` that broke the block.

### block

The ``Block`` that was broken.

### drops

A ``MutableList`` of ``ItemStacks`` that will be added to the tile-entities inventory (or dropped on the ground if the
inventory is full). This list can be modified to change the drops.

## Examples

### Flint from dirt

Adding a 25% chance to get 1 flint when breaking a dirt block with a tile-entity.

=== "Kotlin"

    ```kotlin
    @EventHandler
    fun handleBlockBreak(event: TileEntityBreakBlockEvent) {
        if (event.block.type == Material.DIRT
            && Random.nextInt(0, 100) <= 25  // 25% chance
        ) {
            event.drops.add(ItemStack(Material.FLINT, 1)) // Add a flint to the drops
        }
    }
    ```

=== "Java"

    ```java
    @EventHandler
    public void handleBlockBreak(TileEntityBreakBlockEvent event) {
        if (event.getBlock().getType() == Material.DIRT
            && random.nextInt(100) <= 25 // 25% chance
        ) {
            List<ItemStack> drops = event.getDrops();
            drops.add(new ItemStack(Material.FLINT, 1)); // Add a flint to the drops
            event.setDrops(drops);
        }
    }
    ```