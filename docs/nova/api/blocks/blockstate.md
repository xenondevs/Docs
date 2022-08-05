# BlockState

A BlockSate is extra data associated with a block used to determine how a block looks and behaves. The API only exposes
the [``NovaMaterial``](../material/index.md) and the location of the block via the ``NovaBlockState`` class.

## Getting the NovaMaterial of a block at a specific location

=== "Kotlin"

    ```kotlin
    val blockState = blockManager.getBlock(location) ?: return
    val material = blockState.material
    val location = blockState.location
    ```

=== "Java"

    ```java
    NovaBlockState blockState = blockManager.getBlock(location);
    if (blockState == null)
        return;
    NovaMaterial material = blockState.getMaterial();
    Location location = blockState.getLocation();
    ```

## TileEntity block states

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

For more information about the BlockManager, see the [BlockManager](blockmanager.md) page.