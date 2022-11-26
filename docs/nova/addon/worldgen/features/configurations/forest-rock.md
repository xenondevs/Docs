# Forest rock feature

The `forest_rock` feature can be used to generate small $3x3$ rocks in the world.

## Configuration

Only the block state used for the rocks is configurable:

| Option  | Type                                    | Description                          |
|---------|-----------------------------------------|--------------------------------------|
| `state` | A  [`BlockState`](../../block-state.md) | The block state to use for the rock. |

## Example

```json title="configured_feature/forest_rock.json"
{
  "type": "minecraft:forest_rock",
  "config": {
    "state": {
      "Name": "minecraft:mossy_cobblestone"
    }
  }
}
```

```json title="placed_feature/forest_rock.json"
{
  "feature": "minecraft:forest_rock",
  "placement": [
    {
      "type": "minecraft:count",
      "count": 2 // (1)!
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:heightmap",
      "heightmap": "MOTION_BLOCKING" // (3)!
    },
    {
      "type": "minecraft:biome" // (4)!
    }
  ]
}
```

1. Generate 2 rocks per chunk.
2. Randomly offset the x- and z-coordinates of the rock.
3. Set the y-coordinate of the rock to the highest motion-blocking block.
4. Only generate the feature if we haven't moved to another biome that doesn't have the `forest_rock` feature.

![Example](https://i.imgur.com/6IQPkov.jpeg)