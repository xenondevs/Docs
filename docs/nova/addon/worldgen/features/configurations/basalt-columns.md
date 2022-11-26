# Basalt columns feature

The `basalt_columns` feature allows you to add basalt columns to the world.

## Configuration

The `basalt_columns` feature has the following configuration options:

| Option   | Type                                                                              | Description                                                                                        |
|----------|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `reach`  | An [`IntProvider`](../placed-feature.md#int-providers) whose value is in $[0;3]$. | Determines the maximum radius from the center of the current column cluster.                       |
| `height` | An `IntProvider` whose value is in $[1;10]$.                                      | Determines the maximum height of the current column cluster. (Actual height is $\text{height} + 1$ |

## Example

As an example, here's the configured and placed feature for the large basalt columns in the nether.

```json title="configured_feature/large_basalt_columns.json"
{
  "type": "minecraft:basalt_columns",
  "config": {
    "reach": { // (1)!
      "type": "minecraft:uniform",
      "value": {
        "max_inclusive": 3,
        "min_inclusive": 2
      }
    },
    "height": { // (2)!
      "type": "minecraft:uniform",
      "value": {
        "max_inclusive": 10,
        "min_inclusive": 5
      }
    }
  }
}
```

1. Randomly chooses a radius between 2 and 3.
2. Randomly chooses a height between 5 and 10.

```json title="placed_feature/large_basalt_columns.json"
{
  "feature": "minecraft:large_basalt_columns",
  "placement": [
    {
      "type": "minecraft:count_on_every_layer", // (1)!
      "count": 2
    },
    {
      "type": "minecraft:biome" // (2)!
    }
  ]
}
```

1. Spreads the basalt columns to multiple layers.
2. Only place the columns in biomes that have basalt.

![Example](https://i.imgur.com/WWO0Pdy.jpeg)