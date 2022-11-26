# Random selector feature

The `random_selector` feature can be used to randomly choose from a provided list of features to place.

## Configuration

The `random_selector` feature has the following configuration options:

| Option     | Type                                                                                                                            | Description                                                              |
|------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `features` | A list of [placed features](../placed-feature.md) objects or id's (inside the `feature` option) and their corresponding chance. | The list of features to choose from.                                     |
| `default`  | A placed feature                                                                                                                | The default feature to place if none of the provided features got picked |

## Example

As an example, here's the random selector used to generate tree in the old growth taiga biome

```json title="configured_feature/trees_old_growth_spruce_taiga.json"
{
  "type": "minecraft:random_selector",
  "config": {
    "features": [
      { // (1)!
        "chance": 0.33333334,
        "feature": "minecraft:mega_spruce_checked" // (2)!
      },
      { // (3)!
        "chance": 0.33333334,
        "feature": "minecraft:pine_checked"
      }
    ],
    "default": "minecraft:spruce_checked" // (4)!
  }
}
```

1. A mega spruce tree with a $^1/_{3}$ chance.
2. As previously mentioned, this could also be an entire placed feature object. 
3. A pine tree with a $^1/_{3}$ chance.
4. A spruce tree with a $^1/_{3}$ chance.

![Example](https://i.imgur.com/JJZoK77.jpeg)