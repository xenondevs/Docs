# Large dripstone feature

!!! warning

     Advanced Knowledge Required - This documentation page is intended for users with in-depth knowledge of the world 
     generation system. Beginner users may find the content challenging to understand.

The `large_dripstone` feature generates large dripstone formations in the world.

## Configuration

The `large_dripstone` feature has the following configuration options. Some of these options are pretty hard to understand.
Make sure to check out [this graph](https://www.desmos.com/calculator/8epce7fyjr) to play around with the values.

| Option                                                               | Type                                                                                                     | Description                                                                            |
|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `floor_to_ceiling_search_range` (optional in Json, defaults to `30`) | An `int`. (Range limit in Json is $[1;512]$)                                                             | Determines the maximum distance from the base of the dripstone cluster to the ceiling. |
| `column_radius`                                                      | An [`IntProvider`](../../types/number-provider.md#intprovider). (Range limit in Json is $[1;60]$)        | Sampled twice to get the min and max radius of the dripstone column.                   |
| `height_scale`                                                       | A [`FloatProvider`](../../types/number-provider.md#floatprovider). (Range limit in Json is $[0.0;20.0]$) | The height scale of the dripstone column.                                              |
| `max_column_radius_to_cave_height_ratio`                             | A `float`. (Range limit in Json is $[0.0;1.0]$)                                                          | The ratio of the max radius to the cave height.                                        |
| `stalactite_bluntness`                                               | A `FloatProvider`. (Range limit in Json is $[0.0;10.0]$)                                                 | Determines the height of the stalactite tip.                                           |
| `stalagmite_bluntness`                                               | A `FloatProvider`. (Range limit in Json is $[0.0;10.0]$)                                                 | Determines the height of the stalagmite tip.                                           |
| `wind_speed`                                                         | A `FloatProvider`. (Range limit in Json is $[0.0;2.0]$)                                                  | Higher values lead to a bigger inclination of the dripstone.                           |
| `min_radius_for_wind`                                                | An `int`. (Range limit in Json is $[1;100]$)                                                             | The minimum column radius for the wind to have an effect.                              |
| `min_bluntness_for_wind`                                             | A `float`. (Range limit in Json is $[0.0;5.0]$)                                                          | The minimum bluntness for the wind to have an effect.                                  |

In code, the `LargeDripstoneConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured and placed feature for the vanilla large dripstone formations.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val LARGE_DRIPSTONE = registerConfiguredFeature(
            "large_dripstone",
            Feature.LARGE_DRIPSTONE,
            LargeDripstoneConfiguration(
                30, // floorToCeilingSearchRange
                UniformInt.of(3, 19), // columnRadius
                UniformFloat.of(0.4f, 2.0f), // heightScale
                0.33f, // maxColumnRadiusToCaveHeightRatio
                UniformFloat.of(0.3f, 0.9f), // stalactiteBluntness
                UniformFloat.of(0.4f, 1.0f), // stalagmiteBluntness
                UniformFloat.of(0.0f, 0.3f), // windSpeed
                4, // minRadiusForWind
                0.6f // minBluntnessForWind
            )
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val LARGE_DRIPSTONE = placedFeature("large_dripstone", ConfiguredFeatures.LARGE_DRIPSTONE)
            .count(UniformInt.of(10, 48))
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

    ```json title="configured_feature/large_dripstone.json"
    {
      "type": "minecraft:large_dripstone",
      "config": {
        "column_radius": {
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 19,
            "min_inclusive": 3
          }
        },
        "floor_to_ceiling_search_range": 30,
        "height_scale": {
          "type": "minecraft:uniform",
          "value": {
            "max_exclusive": 2.0,
            "min_inclusive": 0.4
          }
        },
        "max_column_radius_to_cave_height_ratio": 0.33,
        "min_bluntness_for_wind": 0.6,
        "min_radius_for_wind": 4,
        "stalactite_bluntness": {
          "type": "minecraft:uniform",
          "value": {
            "max_exclusive": 0.9,
            "min_inclusive": 0.3
          }
        },
        "stalagmite_bluntness": {
          "type": "minecraft:uniform",
          "value": {
            "max_exclusive": 1.0,
            "min_inclusive": 0.4
          }
        },
        "wind_speed": {
          "type": "minecraft:uniform",
          "value": {
            "max_exclusive": 0.3,
            "min_inclusive": 0.0
          }
        }
      }
    }
    ```
    
    ```json title="placed_feature/large_dripstone.json"
    {
      "feature": "minecraft:large_dripstone",
      "placement": [
        {
          "type": "minecraft:count",
          "count": {
            "type": "minecraft:uniform",
            "value": {
              "max_inclusive": 48,
              "min_inclusive": 10
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

=== "Alone"

    <p class="text-center">
      <img src="https://i.imgur.com/oDNXy5N.png" width="50%" alt="Example"/>
    </p>

=== "Naturally generated"

    <p class="text-center">
      <img src="https://i.imgur.com/eRK2Jf9.jpeg" alt="Example"/>
    </p>