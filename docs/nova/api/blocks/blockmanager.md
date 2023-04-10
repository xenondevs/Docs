# BlockManager

The BlockManager allows you to interact with Nova's blocks. You can place/destroy/get drops/etc.

You can get the ``BlockManager`` using [the previously retrieved Nova instance](../index.md).

=== "Kotlin"

    ```kotlin
    val blockManager = Nova.blockManager
    ```

=== "Java"

    ```java
    BlockManager blockManager = nova.getBlockManager(); // (1)!
    ```

    1. "nova" is the previously retrieved Nova instance, preferably saved in a field/variable.<br>You can also call ``Nova.getNova().getBlockManager()``

## Getting a BlockState

The BlockManager also allows you to get a BlockState at a specific location.

=== "Kotlin"

    ```kotlin
    val blockState = blockManager.getBlock(location) ?: return
    ```

=== "Java"
    
    ```java
    NovaBlockState blockState = blockManager.getBlock(location);
    if (blockState == null)
        return;
    ```

You can also check if a block at a specific location is a Nova block via ``BlockManager.hasBlock(Location)``

### Block Type

`NovaBlock` is a block type, similar to `Material` in Bukkit, except that it is only for blocks.  
To retrieve the block type of block at a specific location, you can do the following:

=== "Kotlin"

    ```kotlin
    val blockState = blockManager.getBlock(location) ?: return
    val block = blockState.block
    ```

=== "Java"

    ```java
    NovaBlockState blockState = blockManager.getBlock(location);
    if (blockState == null)
        return;
    NovaBlock block = blockState.getBlock();
    ```

### Tile Entity

[TileEntities](../tileentity/tileentity.md) use the ``NovaTileEntityState`` class via which you can get the TileEntity
instance of the block.

=== "Kotlin"

    ```kotlin
    val blockState = blockManager.getBlock(location) ?: return
    if (blockState is NovaTileEntityState) {
        val tileEntity = blockState.tileEntity
    }
    ```

=== "Java"

    ```java
    NovaBlockState blockState = blockManager.getBlock(location);
    if (blockState == null)
        return;
    if (blockState instanceof NovaTileEntityState tileEntityState) {
        TileEntity tileEntity = tileEntityState.getTileEntity();
    }
    ```

## Placing a block

You can also place a nova block at a specific location by using a [`NovaBlock`](blockregistry.md).

=== "Kotlin"

    ```kotlin
    val block = blockRegistry.get("machines:pulverizer")
    blockManager.placeBlock(
        location, // (1)!
        block, // (2)!
        player, // (3)!
        true // (4)!
    )
    ```

    1. The location at which to place the block.
    2. The block type to place.
    3. The source of the block placement. This doesn't have to be a player, it can also be a tile-entity or similar.
    4. Whether to play a sound when the block is placed.

=== "Java"

    ```java
    NovaBlock block = blockRegistry.get("machines:pulverizer");
    blockManager.placeBlock(
        location, // (1)!
        block, // (2)!
        player, // (3)!
        true // (4)!
    );
    ```

    1. The location at which to place the block.
    2. The block type to place.
    3. The source of the block placement. This doesn't have to be a player, it can also be a tile-entity or similar.
    4. Whether to play a sound when the block is placed.

!!! note

    The ``BlockManager.placeBlock`` function has a few overrides requiring less arguments.

## Getting the drops of a block

If you want to get the drops of a block, you can use the ``BlockManager.getDrops`` function. Again, there are a few
overrides requiring less arguments.

!!! warning

    This function will return ``null`` if there is no nova block at the provided location.

=== "Kotlin"

    ```kotlin
    val drops = blockManager.getDrops(
        location, // (1)!
        player, // (2)!
        tool // (3)!
    )
    ```

    1. The location of the block.
    2. The source, again, this doesn't have to be a player, it can also be a tile-entity or similar.
    3. The tool used to break the block.

=== "Java"

    ```java
    List<ItemStack> drops = blockManager.getDrops(
        location, // (1)!
        player, // (2)!
        tool // (3)!
    );
    ```

    1. The location of the block.
    2. The source, again, this doesn't have to be a player, it can also be a tile-entity or similar.
    3. The tool used to break the block.

## Removing a block

You can remove a block at a specific location by using the ``BlockManager.removeBlock`` function. The function will return
a ``boolean`` whether there was a block at the provided location and whether it was removed successfully.

=== "Kotlin"

    ```kotlin
    blockManager.removeBlock(
        location, // (1)!
        player, // (2)!
        true, // (3)!
        true // (4)!
    )
    ```

    1. The location of the block.
    2. The source, again, this doesn't have to be a player, it can also be a tile-entity or similar.
    3. Whether to play a sound when the block is removed.
    4. Whether break particles should be displayed.

=== "Java"

    ```java
    blockManager.removeBlock(
        location, // (1)!
        player, // (2)!
        true, // (3)!
        true // (4)!
    );
    ```

    1. The location of the block.
    2. The source, again, this doesn't have to be a player, it can also be a tile-entity or similar.
    3. Whether to play a sound when the block is removed.
    4. Whether break particles should be displayed.