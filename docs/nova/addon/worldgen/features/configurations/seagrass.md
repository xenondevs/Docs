# Seagrass feature

The `seagrass` feature allows you to generate seagrass in water.

## Configuration

The `seagrass` feature only has the `probability` option (`float` in the range $[0.0;1.0)$, which determines the chance
of seagrass being generated.

## Example

As an example, here's the configured- and placed feature of seagrass in ocean biomes.

```json title="configured_feature/seagrass_tall.json"
{
  "type": "minecraft:seagrass",
  "config": {
    "probability": 0.8
  }
}
```

```json title="placed_feature/seagrass_deep_warm.json"
{
  "feature": "minecraft:seagrass_tall",
  "placement": [
    {
      "type": "minecraft:in_square"
    },
    {
      "type": "minecraft:heightmap",
      "heightmap": "OCEAN_FLOOR_WG"
    },
    {
      "type": "minecraft:count",
      "count": 80
    },
    {
      "type": "minecraft:biome"
    }
  ]
}
```