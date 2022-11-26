# Huge fungus feature

The `huge_fungus` feature can be used to place huge fungi in the world (used for warped and crimson forests in vanilla).

## Configuration

The `huge_fungus` feature has the following configuration options:

| Option                                    | Type                                   | Description                                                                                       |
|-------------------------------------------|----------------------------------------|---------------------------------------------------------------------------------------------------|
| `hat_state`                               | A [`BlockState`](../../block-state.md) | The block state to use for the hat of the fungus.                                                 |
| `decor_state`                             | A `BlockState`                         | The block state to randomly place under the hat as decoration. (For example shroomlight)          |
| `stem_state`                              | A `BlockState`                         | The block state to use for the stem of the fungus.                                                |
| `valid_base_block`                        | A `BlockState`                         | The block state that needs to be present below the fungus.                                        |
| `planted` (optional, defaults to `false`) | A `boolean`                            | If set to `false`, can only replace `PLANT` material blocks and doesn't drop items when replaced. |

## Example

As an example, here's the configured- and placed feature for the warped fungus:

```json title="configured_feature/warped_fungus_planted.json"
{
  "type": "minecraft:huge_fungus",
  "config": {
    "decor_state": {
      "Name": "minecraft:shroomlight" // (1)!
    },
    "hat_state": {
      "Name": "minecraft:warped_wart_block"
    },
    "stem_state": {
      "Name": "minecraft:warped_stem",
      "Properties": {
        "axis": "y"
      }
    },
    "valid_base_block": {
      "Name": "minecraft:warped_nylium" // (2)!
    },
    "planted": false // (3)!
  }
}
```

1. Randomly placed shroomlight under the hat.
2. Only place the fungus on warped nylium.
3. The fungus is automatically generated, so it shouldn't drop items when another fungus grows into it.

```json title="placed_feature/warped_fungi.json"
{
  "feature": "minecraft:warped_fungus",
  "placement": [
    {
      "type": "minecraft:count_on_every_layer",
      "count": 8
    },
    {
      "type": "minecraft:biome"
    }
  ]
}
```

![Example](https://i.imgur.com/s7lDy1U.jpeg)