# Huge mushroom features

The `huge_brown_mushroom ` and `huge_red_mushroom` features can be used to add huge mushrooms to a biome.

## Configuration

| Option                                     | Type                                                    | Description                                               |
|--------------------------------------------|---------------------------------------------------------|-----------------------------------------------------------|
| `cap_provider`                             | A [`BlockStateProvider`](../../block-state-provider.md) | Determines the block to use for the cap of the mushroom.  |
| `stem_provider`                            | A `BlockStateProvider`                                  | Determines the block to use for the stem of the mushroom. |
| `foliage_radius` (optional, defaults to 2) | An `int`                                                | Determines the radius of the cap.                         |

## Example

As an example, here's the configured- and placed feature for the default huge red mushroom

```json title="configured_feature/huge_red_mushroom.json"
{
  "type": "minecraft:huge_red_mushroom",
  "config": {
    "cap_provider": {
      "type": "minecraft:simple_state_provider",
      "state": {
        "Name": "minecraft:red_mushroom_block",
        "Properties": {
          "down": "false",
          "east": "true",
          "north": "true",
          "south": "true",
          "up": "true",
          "west": "true"
        }
      }
    },
    "stem_provider": {
      "type": "minecraft:simple_state_provider",
      "state": {
        "Name": "minecraft:mushroom_stem",
        "Properties": {
          "down": "false",
          "east": "true",
          "north": "true",
          "south": "true",
          "up": "false",
          "west": "true"
        }
      }
    },  
    "foliage_radius": 2
  }
}
```

```json title="placed_feature/huge_red_mushroom.json"
{
  "feature": {
  "feature": "minecraft:huge_red_mushroom",
  "placement": []
}
```

![Example](https://i.imgur.com/dYXdv36.jpeg)