# TileEntity

A TileEntity is a block that has internal logic and tick-based updates.

## Getting the owner of a TileEntity

=== "Kotlin"

    ```kotlin
    val tileEntity = tileEntityManager.getTileEntityAt(location) ?: return
    val owner = tileEntity.owner
    ```

=== "Java"

    ```java
    TileEntity tileEntity = tileEntityManager.getTileEntityAt(location);
    if (tileEntity == null)
        return;
    OfflinePlayer owner = tileEntity.getOwner();
    ```

##  Getting the localized name of a TileEntity

Using the [``NovaMaterial``](../material/index.md) of a TileEntity, you can get the name of a TileEntity.

For this example, we'll get the english name of a Pulverizer.

=== "Kotlin"

    ```kotlin
    val tileEntity = tileEntityManager.getTileEntityAt(location) ?: return
    val name = tileEntity.material.getLocalizedName("en_us")
    println(name) // prints "Pulverizer"
    ```

=== "Java"

    ```java
    TileEntity tileEntity = tileEntityManager.getTileEntityAt(location);
    if(tileEntity == null)
        return;
    String name = tileEntity.getMaterial().getLocalizedName("en_us");
    System.out.println(name); // prints "Pulverizer"
    ```

## Getting the drops of a TileEntity

These drops include all items in the TileEntity's inventory and the TileEntity itself if ``includeSelf`` is set to ``true``.

=== "Kotlin"

    ```kotlin
    val tileEntity = tileEntityManager.getTileEntityAt(location) ?: return
    val drops = tileEntity.getDrops(includeSelf = true)
    ```

=== "Java"

    ```java
    TileEntity tileEntity = tileEntityManager.getTileEntityAt(location);
    if (tileEntity == null)
        return;
    List<ItemStack> drops = tileEntity.getDrops(true);
    ```

For more information about the TileEntityManager, see the [TileEntityManager](../tileentity/tileentitymanager.md) page.