# Simple random selector feature

Similar to the [random selector](./random-selector.md) feature, the `simple_random_selector` feature can be used to
randomly choose from a provided list of features to place. The only difference being the absence of the `default` and
`probability` options since all features have an equal chance of being picked.

## Configuration

The `simple_random_selector` feature only has the `features` option:

| Option     | Type                                                       | Description                          |
|------------|------------------------------------------------------------|--------------------------------------|
| `features` | Either a single placed feature object/id or a list of them | The list of features to choose from. |

## Example

As mentioned on the [Pointed Dripstone](pointed-dripstone.md) page, the `simple_random_selector` feature is used to
randomly choose between a stalactite and a stalagmite. Here's the full configured- and placed feature.

```json title="configured_feature/pointed_dripstone.json"
{
  "type": "minecraft:simple_random_selector",
  "config": {
    "features": [
      {
        "feature": {
          "type": "minecraft:pointed_dripstone",
          "config": {
            "chance_of_directional_spread": 0.7,
            "chance_of_spread_radius2": 0.5,
            "chance_of_spread_radius3": 0.5,
            "chance_of_taller_dripstone": 0.2
          }
        },
        "placement": [
          {
            "type": "minecraft:environment_scan",
            "allowed_search_condition": {
              "type": "minecraft:matching_blocks",
              "blocks": [
                "minecraft:air",
                "minecraft:water"
              ]
            },
            "direction_of_search": "down",
            "max_steps": 12,
            "target_condition": {
              "type": "minecraft:solid"
            }
          },
          {
            "type": "minecraft:random_offset",
            "xz_spread": 0,
            "y_spread": 1
          }
        ]
      },
      {
        "feature": {
          "type": "minecraft:pointed_dripstone",
          "config": {
            "chance_of_directional_spread": 0.7,
            "chance_of_spread_radius2": 0.5,
            "chance_of_spread_radius3": 0.5,
            "chance_of_taller_dripstone": 0.2
          }
        },
        "placement": [
          {
            "type": "minecraft:environment_scan",
            "allowed_search_condition": {
              "type": "minecraft:matching_blocks",
              "blocks": [
                "minecraft:air",
                "minecraft:water"
              ]
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
          }
        ]
      }
    ]
  }
}
```

```json title="placed_feature/pointed_dripstone.json"
{
  "feature": "minecraft:pointed_dripstone",
  "placement": [
    {
      "type": "minecraft:count",
      "count": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 256,
          "min_inclusive": 192
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
      "type": "minecraft:count",
      "count": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 5,
          "min_inclusive": 1
        }
      }
    },
    {
      "type": "minecraft:random_offset",
      "xz_spread": {
        "type": "minecraft:clamped_normal",
        "value": {
          "deviation": 3.0,
          "max_inclusive": 10,
          "mean": 0.0,
          "min_inclusive": -10
        }
      },
      "y_spread": {
        "type": "minecraft:clamped_normal",
        "value": {
          "deviation": 0.6,
          "max_inclusive": 2,
          "mean": 0.0,
          "min_inclusive": -2
        }
      }
    },
    {
      "type": "minecraft:biome"
    }
  ]
}
```

![Example](https://i.imgur.com/G1ccC52.jpeg)