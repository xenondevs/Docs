# Dripstone cluster feature

The `dripstone_cluster` feature allows you to add dripstone clusters to the world.

## Configuration

The `dripstone_cluster` feature has the following configuration options:
<small>Some of these options might be a bit hard to understand, We'd recommend just checking out the example below.</small>

| Option                                                        | Type                                                                                     | Description                                                                            |
|---------------------------------------------------------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `floor_to_ceiling_search_range`                               | An int in the range $[1;512]$.                                                           | Determines the maximum distance from the base of the dripstone cluster to the ceiling. |
| `height`                                                      | An [`IntProvider`](../placed-feature.md#int-providers) whose value is in $[1;128]$.      | The height of the cluster                                                              |
| `radius`                                                      | An [`IntProvider`](../placed-feature.md#int-providers) whose value is in $[1;128]$.      | The radius of the cluster                                                              |
| `max_stalagmite_stalactite_height_diff`                       | An int in the range $[0;64]$.                                                            | The maximum difference in height between a stalagmite and a stalactite.                |
| `height_deviation`                                            | An int in the range $[1;64]$.                                                            | The height deviation.                                                                  |
| `dripstone_block_layer_thickness`                             | An [`IntProvider`](../placed-feature.md#int-providers) whose value is in $[1;64]$.       | The dripstone block layer thickness.                                                   |
| `density`                                                     | A [`FloatProvider`](../placed-feature.md#float-providers) whose value is in $[0.0;2.0]$. | The density of the dripstone cluster.                                                  |
| `wetness`                                                     | A [`FloatProvider`](../placed-feature.md#float-providers) whose value is in $[0.0;2.0]$. | The wetness of the dripstone cluster. A higher value will lead to more water blocks.   |
| `chance_of_dripstone_column_at_max_distance_from_center`      | A `float` in the range $[0.0;1.0]$.                                                      | The chance of a dripstone column at the maximum distance from the center.              |
| `max_distance_from_edge_affecting_chance_of_dripstone_column` | An int in the range $[1;64]$.                                                            | The maximum distance from the edge affecting the chance of a dripstone column.         |
| `max_distance_from_center_affecting_height_bias`              | An int in the range $[1;64]$.                                                            | The maximum distance from the center affecting the height bias.                        |

## Example

```json title="configured_feature/dripstone_cluster.json"
{
  "type": "minecraft:dripstone_cluster",
  "config": {
    "chance_of_dripstone_column_at_max_distance_from_center": 0.1,
    "density": {
      "type": "minecraft:uniform",
      "value": {
        "max_exclusive": 0.7,
        "min_inclusive": 0.3
      }
    },
    "dripstone_block_layer_thickness": {
      "type": "minecraft:uniform",
      "value": {
        "max_inclusive": 4,
        "min_inclusive": 2
      }
    },
    "floor_to_ceiling_search_range": 12,
    "height": {
      "type": "minecraft:uniform",
      "value": {
        "max_inclusive": 6,
        "min_inclusive": 3
      }
    },
    "height_deviation": 3,
    "max_distance_from_center_affecting_height_bias": 8,
    "max_distance_from_edge_affecting_chance_of_dripstone_column": 3,
    "max_stalagmite_stalactite_height_diff": 1,
    "radius": {
      "type": "minecraft:uniform",
      "value": {
        "max_inclusive": 8,
        "min_inclusive": 2
      }
    },
    "wetness": {
      "type": "minecraft:clamped_normal",
      "value": {
        "deviation": 0.3,
        "max": 0.9,
        "mean": 0.1,
        "min": 0.1
      }
    }
  }
}
```

```json title="placed_feature/dripstone_cluster.json"
{
  "feature": "minecraft:dripstone_cluster",
  "placement": [
    {
      "type": "minecraft:count",
      "count": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 96,
          "min_inclusive": 48
        }
      }
    },
    {
      "type": "minecraft:in_square"
    },
    {
      "type": "minecraft:height_range",
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
      "type": "minecraft:biome"
    }
  ]
}
```

![Example](https://i.imgur.com/eRK2Jf9.jpeg)