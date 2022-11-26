# Root system feature

The `root_system` feature can be used to generate trees with roots.

## Configuration

A root system feature has the following configuration options:

| Option                             | Type                                                        | Description                                                 |
|------------------------------------|-------------------------------------------------------------|-------------------------------------------------------------|
| `required_vertical_space_for_tree` | An `int` in the range $[1;64]$                              | The amount of vertical space required for the tree to grow. |
| `root_radius`                      | An `int` in the range $[1;64]$                              | The radius of the root system.                              |
| `root_placement_attempts`          | An `int` in the range $[1;256]$                             | The amount of attempts to place a root.                     |
| `root_column_max_height`           | An `int` in the range $[1;4096]$                            | The maximum height of a root column.                        |
| `hanging_root_radius`              | An `int` in the range $[1;64]$                              | The radius of hanging roots.                                |
| `hanging_roots_vertical_span`      | An `int` in the range $[0;16]$                              | The vertical span of hanging roots.                         |
| `hanging_root_placement_attempts`  | An `int` in the range $[1;256]$                             | The amount of attempts to place a hanging root.             |
| `allowed_vertical_water_for_tree`  | An `int` in the range $[0;64]$                              | The amount of vertical water allowed for the tree to grow.  |
| `root_replaceable`                 | A block tag starting with `#`                               | The blocks that can be replaced by roots.                   |
| `root_state_provider`              | A [`BlockStateProvider`](../../block-state-provider.md)     | The block state to use for the root.                        |
| `hanging_root_state_provider`      | A `BlockStateProvider`                                      | The block state to use for the hanging root.                |
| `allowed_tree_position`            | A [`BlockPredicate`](../placed-feature.md#block-predicates) | A predicate to check if the tree position is valid.         |
| `feature`                          | A [`PlacedFeature`](../placed-feature.md) object or id      | The feature to place at the tree position.                  |

## Example

As an example, here's the configured- and placed feature for the azalea tree

```json title="configured_feature/rooted_azalea_tree.json"
{
  "type": "minecraft:root_system",
  "config": {
    "allowed_tree_position": {
      "type": "minecraft:all_of",
      "predicates": [
        {
          "type": "minecraft:any_of",
          "predicates": [
            {
              "type": "minecraft:matching_blocks",
              "blocks": [
                "minecraft:air",
                "minecraft:cave_air",
                "minecraft:void_air",
                "minecraft:water"
              ]
            },
            {
              "type": "minecraft:matching_block_tag",
              "tag": "minecraft:leaves"
            },
            {
              "type": "minecraft:matching_block_tag",
              "tag": "minecraft:replaceable_plants"
            }
          ]
        },
        {
          "type": "minecraft:matching_block_tag",
          "offset": [
            0,
            -1,
            0
          ],
          "tag": "minecraft:azalea_grows_on"
        }
      ]
    },
    "allowed_vertical_water_for_tree": 2,
    "feature": {
      "feature": "minecraft:azalea_tree",
      "placement": []
    },
    "hanging_root_placement_attempts": 20,
    "hanging_root_radius": 3,
    "hanging_root_state_provider": {
      "type": "minecraft:simple_state_provider",
      "state": {
        "Name": "minecraft:hanging_roots",
        "Properties": {
          "waterlogged": "false"
        }
      }
    },
    "hanging_roots_vertical_span": 2,
    "required_vertical_space_for_tree": 3,
    "root_column_max_height": 100,
    "root_placement_attempts": 20,
    "root_radius": 3,
    "root_replaceable": "#minecraft:azalea_root_replaceable",
    "root_state_provider": {
      "type": "minecraft:simple_state_provider",
      "state": {
        "Name": "minecraft:rooted_dirt"
      }
    }
  }
}
```

```json title="placed_feature/rooted_azalea_tree.json"
{
  "feature": "minecraft:rooted_azalea_tree",
  "placement": [
    {
      "type": "minecraft:count",
      "count": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 2,
          "min_inclusive": 1
        }
      }
    },
    {
      "type": "minecraft:in_square"
    },
    {
      "type": "minecraft:height_range",
      "height": {
        "type": "minecraft:uniform",
        "max_inclusive": {
          "absolute": 256
        },
        "min_inclusive": {
          "above_bottom": 0
        }
      }
    },
    {
      "type": "minecraft:environment_scan",
      "allowed_search_condition": {
        "type": "minecraft:matching_blocks",
        "blocks": "minecraft:air"
      },
      "direction_of_search": "up",
      "max_steps": 12,
      "target_condition": {
        "type": "minecraft:solid"
      }
    },
    {
      "type": "minecraft:random_offset",
      "xz_spread": 0,
      "y_spread": -1
    },
    {
      "type": "minecraft:biome"
    }
  ]
}
```

![Example](https://i.imgur.com/Qatgkm7.jpeg)