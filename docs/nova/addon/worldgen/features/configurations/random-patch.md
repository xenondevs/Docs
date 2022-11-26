# Random patch feature

The `random_patch` feature can be used to place a feature in a random pattern multiple times. It's mostly used for
vegetation and even has 2 more features for flowers: `flower` and `no_bonemeal_flower`. Their configuration is the same
as the`random_patch` feature, but `flower` features will also be used when applying bonemeal to grass blocks. `no_bonemeal_flower`
only exists to make distinguishing it from other `random_patch` features easier.

## Configuration

The following configuration options are available:

| Option                                | Type                                                                                                      | Description                                                     |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| `tries` (optional, defaults to 128)   | A positive `int`                                                                                          | The amount of times the feature will try to generate.           |
| `xz_spread` (optional, defaults to 7) | A positive `int`                                                                                          | The maximum horizontal distance from the center of the feature. |
| `y_spread` (optional, defaults to 3)  | A positive `int`                                                                                          | The maximum vertical distance from the center of the feature.   |
| `feature`                             | Can either be the name of the placed feature if it was configured elsewhere or the actual placed feature. | The placed feature to generate.                                 |

## Example

```json title="configured_feature/patch_dead_bush.json"
{
  "type": "minecraft:random_patch",
  "config": {
    "feature": { // (1)!
      "feature": { // (2)!
        "type": "minecraft:simple_block",
        "config": {
          "to_place": {
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:dead_bush"
            }
          }
        }
      },
      "placement": [
        {
          "type": "minecraft:block_predicate_filter",
          "predicate": {
            "type": "minecraft:matching_blocks",
            "blocks": "minecraft:air"
          }
        }
      ]
    },
    "tries": 4,
    "xz_spread": 7,
    "y_spread": 3
  }
}
```

1. The placed feature to generate. Can also be the id of a placed feature that was configured elsewhere.
2. The feature's configuration. Can also be the id of a configured feature.

```json title="placed_feature/patch_dead_bush_badlands.json"
{
  "feature": "minecraft:patch_dead_bush",
  "placement": [
    {
      "type": "minecraft:count",
      "count": 20 // (1)!
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:heightmap",
      "heightmap": "WORLD_SURFACE_WG" // (3)!
    },
    {
      "type": "minecraft:biome" // (4)!
    }
  ]
}
```

1. 20 tries to generate the feature.
2. Spread the feature horizontally.
3. Set the y-coordinate to the world surface.
4. Only generate in badlands biomes.

![Example](https://i.imgur.com/KlN0sG2.jpeg)