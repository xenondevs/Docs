# Block pile feature

The `block_pile` can be used to place piles of blocks (for example hay/melons in villages) in the world.

## Configuration

A block pile feature only has the `state_provider` option:

| Option           | Type                                                     | Description                          |
|------------------|----------------------------------------------------------|--------------------------------------|
| `state_provider` | A  [`BlockStateProvider`](../../block-state-provider.md) | The block state to use for the pile. |

## Example

As an example, here's the placed and configured feature used to place piles of hay bales in villages.

```json title="configured_feature/pile_hay.json"
{
  "type": "minecraft:block_pile",
  "config": {
    "state_provider": {
      "type": "minecraft:rotated_block_provider",
      "state": {
        "Name": "minecraft:hay_block",
        "Properties": {
          "axis": "y" // (1)!
        }
      }
    }
  }
}
```

1. Randomly rotate the hay bales.

```json title="placed_feature/pile_hay.json"
{
  "feature": "minecraft:pile_hay",
  "placement": [] // (1)!
}
```

1. The feature does all the location resolving itself.

![Example](https://i.imgur.com/X78JYVA.jpeg)