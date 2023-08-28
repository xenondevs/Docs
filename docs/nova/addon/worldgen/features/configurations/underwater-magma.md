# Underwater magma feature

The `underwater_magma` feature can be used to generate magma blocks underwater.

## Configuration

The `underwater_magma` feature has the following configuration options:

| Option                                     | Type                                            | Description                                                                             |
|--------------------------------------------|-------------------------------------------------|-----------------------------------------------------------------------------------------|
| `floor_search_range`                       | An `int`. (Range limit in Json is $[0;512]$)    | The maximum y-distance from the origin `Blockpos` of the feature to search for a floor. |
| `placement_radius_around_floor`            | An `int`. (Range limit in Json is $[0;64]$)     | The radius around the floor to place magma blocks.                                      |
| `placement_probability_per_valid_position` | A `float`. (Range limit in Json is $[0.0;1.0]$) | The probability that a magma block will be placed at a valid position.                  |

In code, the `UnderwaterMagmaConfiguration` class is used to configure the feature.


## Example

As an example, here's the placed and configured feature used to place magma blocks in underwater caves:

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val UNDERWATER_MAGMA = registerConfiguredFeature(
            "underwater_magma",
            Feature.UNDERWATER_MAGMA,
            UnderwaterMagmaConfiguration(
                5, // floor_search_range
                1, // placement_radius_around_floor
                0.5F // placement_probability_per_valid_position
            )
        )
    
    }
    ```
    
    ```kotlin
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val UNDERWATER_MAGMA = placedFeature("underwater_magma", ConfiguredFeatures.UNDERWATER_MAGMA)
            .count(UniformInt.of(44, 52)) // (1)!
            .inSquareSpread() // (2)!
            .inYWorldBounds() // (3)!
            .surfaceRelativeThresholdFilter(Heightmap.Types.OCEAN_FLOOR_WG, Int.MIN_VALUE, -2) // (4)!
            .biomeFilter() // (5)!
            .register()
    
    }
    ```
    
    1. Random amount between 44 and 52.
    2. Randomly spread the blocks horizontally.
    3. Constant for
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(256))
       ```
    4. Only place the feature if it's at least 2 blocks below the ocean floor.
    5. Only place the feature in biomes that have underwater magma.

=== "Json"

    ```json title="configured_feature/underwater_magma.json""
    {
       "type": "minecraft:underwater_magma",
       "config": {
          "floor_search_range": 5,
          "placement_probability_per_valid_position": 0.5,
          "placement_radius_around_floor": 1
       }
    }
    ```
    
    ```json title="placed_feature/underwater_magma.json"
    {
       "feature": "minecraft:underwater_magma",
       "placement": [
          {
             "type": "minecraft:count", // (1)!
             "count": {
                "type": "minecraft:uniform",
                "value": {
                   "max_inclusive": 52,
                   "min_inclusive": 44
                }
             }
          },
          {
             "type": "minecraft:in_square" // (2)!
          },
          {
             "type": "minecraft:height_range", // (3)!
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
             "type": "minecraft:surface_relative_threshold_filter", // (4)!
             "heightmap": "OCEAN_FLOOR_WG",
             "max_inclusive": -2
          },
          {
             "type": "minecraft:biome" // (5)!
          }
       ]
    }
    ```

    1. Random amount between 44 and 52.
    2. Randomly spread the blocks horizontally.
    3. Constant for
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(256))
       ```
    4. Only place the feature if it's at least 2 blocks below the ocean floor.
    5. Only place the feature in biomes that have underwater magma.

## Result

![Example](https://i.imgur.com/MERVDnv.png)