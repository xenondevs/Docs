# TileEntityManager

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

## Getting a TileEntity at a specific location

Getting a TileEntity at a specific location is done by calling the ``getTileEntityAt`` function of the ``TileEntityManager``.
The function either returns a TileEntity or ``null`` if there is no TileEntity at the specified location.

=== "Kotlin"
    
    ```kotlin
    val tileEntity: TileEntity? = tileEntityManager.getTileEntityAt(location)
    ```

=== "Java"

    ```java
    TileEntity tileEntity = tileEntityManager.getTileEntityAt(location);
    ```