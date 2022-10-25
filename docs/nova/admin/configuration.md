# Configuring Nova

All config files are located in under `plugins/Nova/configs/`.
Every addon has its own subdirectory with its own config files.

Most of the options in the configs are self-explanatory or explained using comments.
The following section explains the more complex configuration options.

## Items Menu
You might want to customize the Nova items menu. In order to do that, just edit `plugins/Nova/configs/item_categories.yml`. You can add or remove categories and change icon, name and items.

!!! warning

    After applying changes to `item_categories.json`, the file will not be automatically updated anymore. This will cause items from newly added or updated items to not appear and will prevent Nova from working properly after removing an addon whose items are listed here.

## Tile-Entity limits

With tile-entity limits, you can create restrictions on which tile-entities players are allowed to place.  
Tile-Entity limits are configured in the `performance.tile_entity_limits` section.  
Players with the permission `nova.misc.bypassTileEntityLimits` will be able to bypass these restrictions.

There are 5 different limiters. You can choose one or combine multiple:

|       Name       | Description                                                                     |
|:----------------:|:--------------------------------------------------------------------------------|
|      world       | Prevent placing tile entities in specific worlds.                               |
|    type_world    | Prevent placing specific tile-entities in specific worlds.                      |
|      amount      | Set a maximum amount of tile-entities of a type for each player.                |
| amount_per_world | Set a maximum amount of tile-entities of a type for each player for each world. |
| amount_per_chunk | Set a maximum amount of tile-entities of a type for each player for each chunk. |

Example configs:

=== "world"

    ```yaml
    # This example config prevents players from placing tile-entities in the nether and end dimension.
    performance:
      tile_entity_limits:
        world:
          worlds:
            - world_nether
            - world_the_end
    ```

=== "type_world"

    ```yaml
    # This example config prevents players from placing quarries in the overworld and pulverizers in the nether.
    performance:
      tile_entity_limits:
        type_world:
          world:
            - machines:quarry
          world_nether:
            - machines:pulverizer
    ```

=== "amount"

    ```yaml
    # This example config sets a maximum amount of one quarry and 50 cables of each type for every player.
    performance:
      tile_entity_limits:
        amount:
          '*': 100 # Not mandatory, but this option would limit the total amount of tile-entities to 100 per player.
          machines:quarry: 1
          logistics:basic_cable: 50
          logistics:advanced_cable: 50
          logistics:elite_cable: 50
          logistics:ultimate_cable: 50
    ```

=== "amount_per_world"

    ```yaml
    # This example config sets a maximum of one quarry per player per world.
    performance:
      tile_entity_limits:
        amount_per_world:
          '*': 100 # Not mandatory, but this option would limit the total amount of tile-entities to 100 per player per world.
          machines:quarry: 1
    ```

=== "amount_per_chunk"

    ```yaml
    # This example config sets a maximum of one quarry per player per world.
    performance:
      tile_entity_limits:
        amount_per_chunk:
          '*': 5 # Not mandatory, but this option would limit the total amount of tile-entities to 5 per player per chunk.
          machines:quarry: 1
    ```

## Upgrade values

The upgrade values for the default upgrade types `speed`, `efficiency`, `energy`, `fluid` and `range`
are not located in the main config `plugins/Nova/configs/config.yml` but in `plugins/Nova/configs/nova/upgrade_values.json`.
This separation is done intentionally to indicate that every addon can have its own `upgrade_values.json` file for their own upgrade types.

The config for the default upgrades looks like this:
```yaml
speed: [ 1.0, 1.91, 2.82, 3.73, 4.64, 5.55, 6.46, 7.37, 8.28, 9.19, 10.0 ]
efficiency: [ 1.0, 1.25, 1.75, 2.75, 3.75, 4.75, 5.75, 6.75, 7.75, 8.75, 9.75 ]
energy: [ 1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1, 10.0 ]
fluid: [ 1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1, 10.0 ]
range: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
```

The amount of values in the arrays specifies the amount of upgrades that can be added, the numbers themselves are the modifiers.
Depending on the type of upgrade, these values might be a multipliers or in the case of the range upgrade, are just added on top of the default max range.

The upgrade values can also be changed for specific tile-entities by adding a `upgrade_values` section to the config of that tile-entity.
For example, the default limit of range upgrades for the Pump from the Machines addon is changed to 30 this way:
```yaml
upgrade_values:
  range: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ]
```