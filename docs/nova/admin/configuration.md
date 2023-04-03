# Configuring Nova

All config files are located in under `plugins/Nova/configs/`.
Every addon has its own subdirectory with its own config files.

Most of the options in the configs are self-explanatory or explained using comments.
The following section explains the more complex configuration options.

## Items Menu
You might want to customize the Nova items menu. In order to do that, just edit `plugins/Nova/configs/item_categories.yml`. You can add or remove categories and change icon, name and items.

!!! warning

    After modifying `item_categories.json`, the file will not be automatically updated anymore.
    This will prevent items from newly added addons from appearing, so you will have to add those yourself.

## Tile-Entity limits

With tile-entity limits, you can create restrictions on which tile-entities players are allowed to place.  
Tile-Entity limits are configured in the `performance.tile_entity_limits` section.  
Players with the permission `nova.misc.bypassTileEntityLimits` will be able to bypass these restrictions.

There are 6 different limiters. You can choose one or combine multiple:

|       Name       | Description                                                                     |
|:----------------:|:--------------------------------------------------------------------------------|
|       type       | Prevent placing a specific tile-entity.                                         |
|      world       | Prevent placing tile entities in specific worlds.                               |
|    type_world    | Prevent placing specific tile-entities in specific worlds.                      |
|      amount      | Set a maximum amount of tile-entities of a type for each player.                |
| amount_per_world | Set a maximum amount of tile-entities of a type for each player for each world. |
| amount_per_chunk | Set a maximum amount of tile-entities of a type for each player for each chunk. |

Example configs:

=== "type"

    ```yaml
    # This example config prevents players from placing the quarry.
    performance:
      tile_entity_limits:
        type:
          - machines:quarry
    ```

=== "world"

    ```yaml
    # This example config prevents players from placing tile-entities in the nether and end dimension.
    performance:
      tile_entity_limits:
        world:
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

Every addon can register its own upgrade types. As a server administrator, you can configure these values in the
`plugin/Nova/configs/<addon name>/upgrade_values.yml` file.

The config of the `simple_upgrades` addon looks like this:
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

## Attribute Modifiers

Every item configuration file can have an `attribute_modifiers` section.

```yaml title="Structure of the attribute_modifiers section"
attribute_modifiers:
  <equipment_slot>: # (1)!
  - attribute: <attribute> # (2)!
    operation: <operation> # (3)!
    value: <value> # (4)!
    hidden: <hidden> # (5)!
```

1. The equipment slot that this item needs to be in for the attribute modifier to apply.  
    Possible values: `mainhand`, `offhand`, `feet`, `legs`, `chest`, `head`
2. The attribute to modify.  
    Available attributes: `generic.maxHealth`, `generic.followRange`, `generic.knockbackResistance`, `generic.movementSpeed`,
    `generic.flying_speed`, `generic.attackDamage`, `generic.attack_knockback`, `generic.attackSpeed`, `generic.armor`,
    `generic.armorToughness`, `generic.luck`
3. The operation to perform.  
    Possible operations: `addition`, `multiply_base`, `multiply_total`
4. The value to modify the attribute with.
5. Whether the attribute should be hidden from the item's lore.  
    Default: `false`

??? example "Example configuration"

    ```yaml
    # The following configuration increases the player's attack damage by 5 if the item is held in the main hand
    # and increases the movement speed by 10% for both the main hand and off hand.
    
    attribute_modifiers:
      mainhand:
      - attribute: generic.attack_damage
        operation: addition
        value: 5.0
      offhand:
      - attribute: generic.movement_speed
        operation: multiply_base
        value: 0.1
      - attribute: generic.movement_speed
        operation: multiply_base
        value: 0.1
    ```
    
    ![](https://i.imgur.com/TIjCNto.png)

## Resource Filters

Resource filters allow you to exclude certain files from the resource pack. They are configured in the main config
under `resource_pack.generation.resource_filters`.

```yaml
resource_pack:
  generation:
    content_filters:
    - stage: "" # (1)!
      type: "" # (2)!
      pattern_type: "" # (3)!
      filter: "" # (4)!
      directory: "" # (5)!
```

1. The stage at which the filter should be applied. Can be `asset_pack` or `resource_pack`.
2. The type of the filter. Can be `whitelist` or `blacklist`.
3. The pattern type of the `filter` field. Can be `regex` or `wildcard`.
4. The filter pattern to match against. The `pattern_type` field determines how the pattern is interpreted.
5. The directory to apply the filter to. This property is optional and defaults to the root directory.

??? example "Example: Excluding all language files except en_us.json and de_de.json"

    ```yaml
    resource_pack:
      generation:
        resource_filters:
        - stage: resource_pack
          type: whitelist
          pattern_type: regex
          filter: minecraft\/lang\/(en_us|de_de).json
          directory: minecraft/lang/
    ```

## WAILA Positioning

If you want to change the vertical position of the WAILA overlay, you can do so by defining which boss bars should be
above or below it. This is done by defining matchers in `waila.positioning.above` (defines the boss bars that should
be below WAILA) and `waila.positioning.below` (defines the boss bars that should be above WAILA).

There are five different types of matchers available:

| Type      | Description                                                                                                               |
|-----------|---------------------------------------------------------------------------------------------------------------------------|
| `origin`  | Matches against the origin of the boss bar. (Either `minecraft` or a plugin name.)                                        |
| `text`    | Matches against the text of the boss bar using either a regex or wildcard.                                                |
| `overlay` | Matches against the overlay id of a boss bar overlay from a different Nova addon.                                         |
| `uuid`    | Matches against the UUID of the boss bar.                                                                                 |
| `index`   | Matches against the index of the boss bar (before Nova rearranges them), with the uppermost boss bar starting at index 0. |

=== "Origin"

    ```yaml
    waila:
      positioning:
        above:
        - type: origin
          origin: <origin> # (1)!
    ```

    1. The origin to match against. Can be `minecraft` or a plugin name.

=== "Text"

    === "Wildcard"


        ```yaml
        waila:
          positioning:
            above:
            - type: text
              wildcard: <pattern> # (1)!
        ```

        1. The wildcard pattern to match against.  
           Use `*` to match any number of characters and `?` to match a single character.

    === "Regex"

        ```yaml
        waila:
          positioning:
            above:
            - type: text
              regex: <pattern> # (1)!
        ```

        1. The regex pattern to match against.  
           You can try out your regex pattern on [RegExr](https://regexr.com/).

=== "Overlay"

    ```yaml
    waila:
      positioning:
        above:
        - type: overlay
          overlay: <overlay id> # (1)!
    ```

    1. The overlay id of a boss bar overlay from a different Nova addon.  
       For example, WAILA's overlay id is `nova:waila`.

=== "UUID"

    ```yaml
    waila:
      positioning:
        above:
        - type: uuid
          uuid: <uuid> # (1)!
    ```

    1. The UUID to match against.

=== "Index"

    ```yaml
    waila:
      positioning:
        above:
        - type: index
          index: <index> # (1)!
    ```

    1. The index of the boss bar. Starts at 0, from the top down.

??? example "Example configuration"

    This example configuration places WAILA above all vanilla boss bars, but below all boss bars registered by `PluginA` and `PluginB`.

    ```yaml
    waila:
      positioning:
        above:
        - type: origin
          origin: minecraft
        below:
        - type: origin
          origin: PluginA
        - type: origin
          origin: PluginB
    ```