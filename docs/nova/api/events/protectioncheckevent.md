# ProtectionCheckEvent

The ``ProtectionCheckEvent`` is called when Nova checks if a player or tile-entity is allowed to break/place or interact 
with a block. For example, if a BlockBreaker tries to break a block and all default implemented protection checks allow
the block to be broken, the ``ProtectionCheckEvent`` is called. It can be used to implement custom protection checks.

## Properties

### source

This can be either

1. ``Source`` which contains an ``OfflinePlayer``
2. ``TileEntitySource`` which contains an ``OfflinePlayer`` (the owner of the tile-entity) and a ``TileEntity``

The TileEntitySource is a subclass of Source, so you can always access the OfflinePlayer via ``source.player``.

### type

The ProtectionType to be checked. The following are possible

- ``BREAK``
- ``PLACE``
- ``USE_BLOCK``
- ``USE_ITEM``
- ``INTERACT_ENTITY``
- ``HURT_ENTITY``

### location

The location of the block to be checked.

### allowed

This ``boolean`` can be set to ``false`` if the interaction shouldn't be allowed. It is set to ``true`` by default.

## Examples

### Spawn example

=== "Kotlin"

    ```kotlin
    @EventHandler
    fun handleProtectionCheck(event: ProtectionCheckEvent) {
        val location = event.location // Get the location of the block to be checked
        if (event.type != ProtectionType.USE_BLOCK // Allow blocks to be used in the spawn area
            && location.world == farmWorld // Do some internals checks
            && isInSpawnArea(location)
        ) {
            event.allowed = false // Disallow the interaction
        }
    }
    ```

=== "Java"

    ```java
    @EventHandler
    public void handleProtectionCheck(ProtectionCheckEvent event) {
        Location location = event.getLocation(); // Get the location of the block to be checked
        if (event.getType() != ProtectionType.USE_BLOCK // Allow blocks to be used in the spawn area
            && location.getWorld().equals(farmWorld)  // Do some internals checks
            && isInSpawnArea(location)
        ) {
            event.setAllowed(false); // Disallow the interaction
        }
    }
    ```

### Checking for different source types.

=== "Kotlin"

    ```kotlin
    @EventHandler
    fun handleProtectionCheck(event: ProtectionCheckEvent) {
        val source = event.source
        val player = source.player // (1)
        if (source is TileEntitySource) {
            val tileEntity = source.tileEntity // (2)
            // ...
        } else { // Event isn't related to a tile-entity.
            // ...
        }
    }
    ```

    1. The ``OfflinePlayer`` can always be accessed via ``source.player``
    2. Kotlin smart casts the ``Source`` to ``TileEntitySource``, so you can access the ``TileEntity`` via ``source.tileEntity``

=== "Java"

    ```java
    @EventHandler
    public void handleProtectionCheck(ProtectionCheckEvent event) {
        Source source = event.getSource();
        OfflinePlayer player = source.getPlayer(); // (1)
        if (source instanceof TileEntitySource) {
            TileEntitySource tileEntitySource = (TileEntitySource) source; // (2)
            TileEntity tileEntity = ((TileEntitySource) source).getTileEntity(); // (3)
            // ...
        } else { // Event isn't related to a tile-entity.
            // ...
        }
    }
    ```

    1. The ``OfflinePlayer`` can always be accessed via ``source.player``
    2. The ``ProtectionCheckEvent`` is called by a tile-entity, so we can cast the ``Source`` to ``TileEntitySource``.
    3. Get the tile-entity via ``source.tileEntity``
