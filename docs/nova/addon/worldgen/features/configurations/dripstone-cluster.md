# Dripstone cluster feature

!!! warning

     Advanced Knowledge Required - This documentation page is intended for users with in-depth knowledge of the world 
     generation system. Beginner users may find the content challenging to understand.

The `dripstone_cluster` feature allows you to add dripstone clusters to the world.

## Configuration

The `dripstone_cluster` feature has the following configuration options:  
<small>Some of these options might be a bit hard to understand, We'd recommend just checking out the example below.</small>

| Option                                                        | Type                                                                                                    | Description                                                                            |
|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `floor_to_ceiling_search_range`                               | An `int`. (Range limit in Json is $[1;512]$)                                                            | Determines the maximum distance from the base of the dripstone cluster to the ceiling. |
| `height`                                                      | An [`IntProvider`](../../types/number-provider.md#intprovider) (Range limit in Json is $[1;128]$)       | The height of the cluster                                                              |
| `radius`                                                      | An `IntProvider`. (Range limit in Json is $[1;128]$)                                                    | The radius of the cluster                                                              |
| `max_stalagmite_stalactite_height_diff`                       | An `int`. (Range limit in Json is $[0;64]$)                                                             | The maximum difference in height between a stalagmite and a stalactite.                |
| `height_deviation`                                            | An `int`. (Range limit in Json is $[1;64]$)                                                             | The height deviation.                                                                  |
| `dripstone_block_layer_thickness`                             | An `IntProvider`. (Range limit in Json is $[1;64]$)                                                     | The dripstone block layer thickness.                                                   |
| `density`                                                     | A [`FloatProvider`](../../types/number-provider.md#floatprovider). (Range limit in Json is $[0.0;2.0]$) | The density of the dripstone cluster.                                                  |
| `wetness`                                                     | A `FloatProvider`. (Range limit in Json is $[0.0;2.0]$)                                                 | The wetness of the dripstone cluster. A higher value will lead to more water blocks.   |
| `chance_of_dripstone_column_at_max_distance_from_center`      | A `float`. (Range limit in Json is $[0.0;1.0]$)                                                         | The chance of a dripstone column at the maximum distance from the center.              |
| `max_distance_from_edge_affecting_chance_of_dripstone_column` | An `int`. (Range limit in Json is $[1;64]$)                                                             | The maximum distance from the edge affecting the chance of a dripstone column.         |
| `max_distance_from_center_affecting_height_bias`              | An `int`. (Range limit in Json is $[1;64]$)                                                             | The maximum distance from the center affecting the height bias.                        |

In code, the `DripstoneClusterConfiguration` class is used to configure the feature.

## Example

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val DRIPSTONE_CLUSTER = registerConfiguredFeature(
            "dripstone_cluster",
            Feature.DRIPSTONE_CLUSTER,
            DripstoneClusterConfiguration(
                12, // floorToCeilingSearchRange
                UniformInt.of(3, 6), // height
                UniformInt.of(2, 8), // radius
                1, // maxStalagmiteStalactiteHeightDiff
                3, // heightDeviation
                UniformInt.of(2, 4), // dripstoneBlockLayerThickness
                UniformFloat.of(0.3f, 0.7f), // density
                ClampedNormalFloat.of(0.1f, 0.3f, 0.1f, 0.9f), // wetness
                0.1f, // chanceOfDripstoneColumnAtMaxDistanceFromCenter
                3, // maxDistanceFromEdgeAffectingChanceOfDripstoneColumn
                8 // maxDistanceFromCenterAffectingHeightBias
            )
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures: FeatureRegistry by ExampleAddon.registry {
    
        val DRIPSTONE_CLUSTER = placedFeature("dripstone_cluster", ConfiguredFeatures.DRIPSTONE_CLUSTER)
            .count(UniformInt.of(48, 96))
            .inSquareSpread()
            .inYWorldBounds() // (1)!
            .biomeFilter()
            .register()
    
    }
    ```

    1. Call is equivalent to: 
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(256))
       ```

=== "Json"

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

## Result

![Example](https://i.imgur.com/bFYJngv.gif)