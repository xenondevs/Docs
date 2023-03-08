# Delta feature

The `delta_feature` is a 1-block deep sheet of a block randomly surrounded by a block (rim). It's normally used to generate
the deltas in the basalt deltas biome.

## Configuration

The following configuration options are available:

| Option     | Type                                                                                      | Description                                                         |
|------------|-------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `contents` | A [`BlockState`](../../block-state.md)                                                    | The block state to use inside of the delta.                         |
| `rim`      | A `BlockState`                                                                            | The block state to use for the rim.                                 |
| `size`     | An [`IntProvider`](../placed-feature.md#int-providers). (Range limit in Json is $[0;16]$) | Determines the maximum radius from the center of the current delta. |
| `rim_size` | An `IntProvider`. (Range limit in Json is $[0;16]$)                                       | Determines the size of the rim.                                     |

In code, the `DeltaFeatureConfiguration` class is used to configure the feature.

## Example

As an example, here's the placed and configured feature used to place deltas in the basalt deltas biome.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val DELTA = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "delta",
        Feature.DELTA_FEATURE,
        DeltaFeatureConfiguration(
            Blocks.LAVA.defaultBlockState(), // contents
            Blocks.MAGMA_BLOCK.defaultBlockState(), // rim
            UniformInt.of(3, 7), // size (1)
            UniformInt.of(0, 2) // rim_size
        )
    )
    ```

    1. Random `int` in the range $[3;7]$.
    
    ```kotlin title="PlacedFeatures.kt"
    val DELTA = FeatureRegistry.registerPlacedFeature(
        Machines,
        "delta",
        ConfiguredFeatures.DELTA,
        listOf(
            CountOnEveryLayerPlacement.of(40), // (1)!
            BiomeFilter.biome() // (2)!
        )
    )
    ```

    1. Spreads the deltas to multiple layers.
    2. Only generate the feature if the center pos hasn't moved to another biome that doesn't have the configured feature.

=== "Json"

    ```json title="configured_feature/delta.json"
    {
      "type": "minecraft:delta_feature",
      "config": {
        "contents": {
          "Name": "minecraft:lava",
          "Properties": {
            "level": "0"
          }
        },
        "rim": {
          "Name": "minecraft:magma_block"
        },
        "rim_size": {
          "type": "minecraft:uniform", // (1)!
          "value": {
            "max_inclusive": 2,
            "min_inclusive": 0
          }
        },
        "size": {
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 7,
            "min_inclusive": 3
          }
        }
      }
    }
    ```

    1. Random `int` in the range $[2;0]$.

    ```json title="placed_feature/delta.json"
    {
      "feature": "minecraft:delta",
      "placement": [
        {
          "type": "minecraft:count_on_every_layer", // (1)!
          "count": 40
        },
        {
          "type": "minecraft:biome" // (2)!
        }
      ]
    }
    ```

    1. Spreads the deltas to multiple layers.
    2. Only generate the feature if the center pos hasn't moved to another biome that doesn't have the configured feature.

## Result

![Example](https://i.imgur.com/Bfy18m5.gif)