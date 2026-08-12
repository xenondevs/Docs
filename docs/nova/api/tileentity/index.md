---
icon: lucide/scan-box
---

# Tile Entities

## TileEntityManager

You can get the ``TileEntityManager`` using [the previously retrieved Nova instance](../index.md).

=== "Kotlin"

    ```kotlin
    val tileEntityManager = Nova.tileEntityManager
    ```

=== "Java"

    ```java
    TileEntityManager tileEntityManager = nova.getTileEntityManager(); // (1)!
    ```

    1. "nova" is the previously retrieved Nova instance, preferably saved in a field/variable.<br>You can also call ``Nova.getNova().getTileEntityManager()``

### Getting a TileEntity at a specific location

Getting a TileEntity at a specific location is done by calling the ``getTileEntityAt`` function of the
``TileEntityManager``. The function either returns a TileEntity or ``null`` if there is no TileEntity at the specified
location.

=== "Kotlin"

    ```kotlin
    val tileEntity: TileEntity? = tileEntityManager.getTileEntityAt(location)
    ```

=== "Java"

    ```java
    TileEntity tileEntity = tileEntityManager.getTileEntityAt(location);
    ```

## TileEntity

A TileEntity is a block that has internal logic and tick-based updates.

### Getting the owner of a TileEntity

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

### Getting the localized name of a TileEntity

Using the [`NovaBlock`](../blocks/index.md) of a TileEntity, you can get the name of a TileEntity.

For this example, we'll get the english name of a Pulverizer.

=== "Kotlin"

    ```kotlin
    val tileEntity = tileEntityManager.getTileEntityAt(location) ?: return
    val name = tileEntity.block.getLocalizedName("en_us")
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

### Getting the drops of a TileEntity

These drops include all items in the TileEntity's inventory and the TileEntity itself if ``includeSelf`` is set to
``true``.

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
