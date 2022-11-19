# Disk feature

The `disk` feature allows you to place disks of blocks in the world.

## Configuration

The `disk` feature has the following configuration options:

| Option           | Type                                                                            | Description                                   |
|------------------|---------------------------------------------------------------------------------|-----------------------------------------------|
| `radius`         | An [IntProvider](../placed-feature.md#int-providers) whose value is in $[0;8]$. | Determines the radius of the disk.            |
| `half_height`    | An `int` in the range $[0;8]$.                                                  | Defines half of the height of the disk.       |
| `target`         | A [`BlockPredicate`](../placed-feature.md#block-predicates)                     | Must be passed in order to generate the disk. |
| `state_provider` | See below.                                                                      | The block state to use for the disk.          |

### State provider

The state provider has 2 main options. `fallback`, a [`BlockStateProvider`](../../block-state-provider.md) that is used
if none of the rules apply, and `rules`, an array of `Rule`s. Each rule has a [`BlockPredicate`](../placed-feature.md#block-predicates)
via the `if_true` option, and a [`BlockStateProvider`](../../block-state-provider.md) via the `then` option.

## Examples

As an example, here's the configured and placed feature for sand disks in lakes:

```json title="configured_feature/disk_sand.json"
{
  "type": "minecraft:disk",
  "config": {
    "half_height": 2,
    "radius": { // (1)!
      "type": "minecraft:uniform",
      "value": {
        "max_inclusive": 6,
        "min_inclusive": 2
      }
    },
    "state_provider": {
      "fallback": { // (2)!
        "type": "minecraft:simple_state_provider",
        "state": {
          "Name": "minecraft:sand"
        }
      },
      "rules": [  // (3)!
        {
          "if_true": {
            "type": "minecraft:matching_blocks",
            "blocks": "minecraft:air",
            "offset": [
              0,
              -1,
              0
            ]
          },
          "then": {
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:sandstone"
            }
          }
        }
      ]
    },
    "target": { // (4)!
      "type": "minecraft:matching_blocks",
      "blocks": [
        "minecraft:dirt",
        "minecraft:grass_block"
      ]
    }
  }
}
```

1. Randomly chooses a radius between 2 and 6.
2. If the block isn't air, use sand.
3. Otherwise, if the block below is air, use sandstone.
4. Only allow `dirt` or `grass_block` in the center.

```json title="placed_feature/disk_sand.json"
{
  "feature": "minecraft:disk_sand",
  "placement": [
    {
      "type": "minecraft:count",
      "count": 3 // (1)!
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:heightmap", // (3)!
      "heightmap": "OCEAN_FLOOR_WG"
    },
    {
      "type": "minecraft:block_predicate_filter", // (4)!
      "predicate": {
        "type": "minecraft:matching_fluids",
        "fluids": "minecraft:water"
      }
    },
    {
      "type": "minecraft:biome" // (5)!
    }
  ]
}
```

1. 3 tries per chunk.
2. Spread the disks in a square.
3. Make sure to move the y coordinate to the ocean floor.
4. Only place the disk if the block is water.
5. Only place the disk if the current biome has sand disks.

![Example](https://i.imgur.com/Hm94ziP.jpeg)