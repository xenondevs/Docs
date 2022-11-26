# Iceberg feature

The `iceberg` feature allows you to add icebergs to the world.

## Configuration

The `iceberg` feature only has one configuration option:

| Option  | Type                                 | Description                              |
|---------|--------------------------------------|------------------------------------------|
| `state` | A [BlockState](../../block-state.md) | The block state to use for the icebergs. |

## Example

As an example, here's the configured and placed feature for the blue icebergs in the deep frozen ocean.

```json title="configured_feature/iceberg_blue.json"
{
  "type": "minecraft:iceberg",
  "config": {
    "state": {
      "Name": "minecraft:blue_ice"
    }
  }
}
```

```json title="placed_feature/iceberg_blue.json"
{
  "feature": "minecraft:iceberg_blue",
  "placement": [
    {
      "type": "minecraft:rarity_filter",
      "chance": 200 // (1)!
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:biome" // (3)!
    }
  ]
}
```

1. Only place a iceberg every 200 chunks.
2. Randomly offset the iceberg horizontally.
3. Only place the iceberg if the location hasn't moved to a biome without icebergs.

![Example](https://i.imgur.com/Rm9v7fd.jpeg)