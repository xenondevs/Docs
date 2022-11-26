# Multiface growth feature

The `multiface_growth` feature is used to generate plants that grow on multiple faces of a block (for example sculk or
glow lichen).

## Configuration

The `multiface_growth` feature has the following configuration options:

| Option                                                | Type                                             | Description                                           |
|-------------------------------------------------------|--------------------------------------------------|-------------------------------------------------------|
| `block` (optional, defaults to `glow_lichen`          | A `String`. Either `glow_lichen` or `sculk_vein` | The block to generate.                                |
| `search_range` (optional, defaults to `10`)           | An `int` in the range $[1;64]$                   | The search range for the next block to grow on.       |
| `chance_of_spreading` (optional, defaults to `0.5`)   | A `float` in the range $[0.0;1.0]$               | The chance that the plant will spread to a new block. |
| `can_place_on_floor` (optional, defaults to `false`)  | A `boolean`                                      | Whether the plant can grow on the floor.              |
| `can_place_on_ceiling` (optional, defaults to `true`) | A `boolean`                                      | Whether the plant can grow on the ceiling.            |
| `can_place_on_wall` (optional, defaults to `true`)    | A `boolean`                                      | Whether the plant can grow on the wall.               |
| `can_be_placed_on`                                    | A single block id, block tag or a list of them   | The blocks the plant can grow on.                     |

## Example

As an example, here's the configured- and placed feature for sculk veins.

```json title="configured_feature/sculk_vein.json"
{
  "type": "minecraft:multiface_growth",
  "config": {
    "block": "minecraft:sculk_vein",
    "search_range": 20,
    "chance_of_spreading": 1.0, // (1)! 
    "can_place_on_floor": true,
    "can_place_on_ceiling": true,
    "can_place_on_wall": true,
    "can_be_placed_on": [ // (2)!
      "minecraft:stone",
      "minecraft:andesite",
      "minecraft:diorite",
      "minecraft:granite",
      "minecraft:dripstone_block",
      "minecraft:calcite",
      "minecraft:tuff",
      "minecraft:deepslate"
    ]
  }
}
```

1. Grow on every block in a 20 block radius.
2. Only grow on typical cave blocks.

```json title="placed_feature/sculk_vein.json"
{
  "feature": "minecraft:sculk_vein",
  "placement": [
    {
      "type": "minecraft:count", // (1)!
      "count": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 250,
          "min_inclusive": 204
        }
      }
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:height_range", // (3)!
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
      "type": "minecraft:biome" // (4)!
    }
  ]
}
```

1. Generate 204-250 attempts per chunk.
2. Randomly offset the attempts horizontally.
3. Set the y-level to a random int up to 256.
4. Only generate in biomes that have sculk growth.

![Example](https://i.imgur.com/yq5KlVA.png)