# Lake feature

!!! warning "Deprecated"

    This feature is marked as deprecated in Minecraft's internal code. It might be removed in a future update.

The `lake` feature can be used to add lakes to a biome (for example the underground lava lakes).

## Configuration

The `lake` feature has the following configuration options:

| Option    | Type                                   | Description                           |
|-----------|----------------------------------------|---------------------------------------|
| `fluid`   | A [`BlockState`](../../block-state.md) | The fluid block to use for the lake.  |
| `barrier` | A `BlockState`                         | The block to use for the lake's edge. |

## Example

As an example, here's the configured- and placed feature for the underground lava lakes that can be found in most biomes.

```json title="configured_feature/lake_lava.json"
{
  "type": "minecraft:lake",
  "config": {
    "fluid": {
      "type": "minecraft:simple_state_provider",
      "state": {
        "Name": "minecraft:lava",
        "Properties": {
          "level": "0"
        }
      }
    },
    "barrier": {
      "type": "minecraft:simple_state_provider",
      "state": {
        "Name": "minecraft:stone"
      }
    }
  }
}
```

```json title="placed_feature/lake_lava_underground.json"
{
  "feature": "minecraft:lake_lava",
  "placement": [
    {
      "type": "minecraft:rarity_filter",
      "chance": 9 // (1)!
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:height_range", // (3)!
      "height": {
        "type": "minecraft:uniform",
        "max_inclusive": {
          "below_top": 0
        },
        "min_inclusive": {
          "absolute": 0
        }
      }
    },
    {
      "type": "minecraft:environment_scan", // (4)!
      "direction_of_search": "down",
      "max_steps": 32,
      "target_condition": {
        "type": "minecraft:all_of",
        "predicates": [
          {
            "type": "minecraft:not",
            "predicate": {
              "type": "minecraft:matching_blocks",
              "blocks": "minecraft:air"
            }
          },
          {
            "type": "minecraft:inside_world_bounds",
            "offset": [
              0,
              -5,
              0
            ]
          }
        ]
      }
    },
    {
      "type": "minecraft:surface_relative_threshold_filter", // (5)!
      "heightmap": "OCEAN_FLOOR_WG",
      "max_inclusive": -5
    },
    {
      "type": "minecraft:biome" // (6)!
    }
  ]
}
```

1. Only place a lake every 9 chunks.
2. Randomly offset the lake horizontally.
3. Set the y-coordinate of the lake to a random value below 0.
4. Search for a block that isn't air and is 5 blocks above the minimum build height.
5. Only place the lake if it's at least 5 blocks below the ocean floor.
6. Only place the lake if the location hasn't moved to a biome without lava lakes.

![Example](https://i.imgur.com/0qX9lE7.png)