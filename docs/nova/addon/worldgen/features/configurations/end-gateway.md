# End gateway feature

The `end_gateway` feature can be used to place end gateways in the world.

## Configuration

An end gateway feature has the following configuration options:

| Option            | Type                                                                  | Description                                                       |
|-------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------|
| `exact`           | `boolean`                                                             | Whether entities should be teleported to the exact exit location. |
| `exit` (optional) | An array of coordinates. First element is the x coordinate and so on. | The exit location of the end gateway.                             |

## Example

Here's the configured and placed feature for the vanilla return end gateway:

```json title="configured_feature/end_gateway_return.json"
{
  "type": "minecraft:end_gateway",
  "config": {
    "exact": true,
    "exit": [ // (1)!
      100,
      50,
      0
    ]
  }
}
```

1. The end spawn point is always at $(100|50|0)$

```json title="placed_feature/end_gateway_return.json"
{
  "feature": "minecraft:end_gateway_return",
  "placement": [
    {
      "type": "minecraft:rarity_filter", // (1)!
      "chance": 700
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:heightmap", // (3)!
      "heightmap": "MOTION_BLOCKING"
    },
    {
      "type": "minecraft:random_offset", // (4)!
      "xz_spread": 0,
      "y_spread": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 9,
          "min_inclusive": 3
        }
      }
    },
    {
      "type": "minecraft:biome" // (5)!
    }
  ]
}
```

1. Give the end gateway a chance of $^1/_{700}$ to spawn. Or in other words, the end gateway will spawn in 1 out of 700 chunks.
2. Randomly offset the gateways in a square.
3. Move the gateways to the surface.
4. Randomly offset the gateways in the y direction.
5. Only place the gateways in biomes that have end gateways.

![Example](https://i.imgur.com/Olaox63.jpeg)