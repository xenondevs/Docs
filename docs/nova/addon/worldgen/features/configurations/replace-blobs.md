# Replace blobs feature

The `replace_blobs` feature can be used to replace specific blobs with a blob of a different block. Although
the name suggests that it only works with netherrack, it can be used with any block.

## Configuration

The `replace_blobs` feature has the following configuration options:

| Option   | Type                                                                                              | Description                                 |
|----------|---------------------------------------------------------------------------------------------------|---------------------------------------------|
| `target` | A [`BlockState`](../../types/block-state.md).                                                     | The block state to replace.                 |
| `state`  | A `BlockState`.                                                                                   | The block state to replace the target with. |
| `radius` | An [`IntProvider`](../../types/number-provider.md#intprovider). (Range limit in Json is $[0;12]$) | The radius of the blob.                     |

In code, the `ReplaceSphereConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature for blackstone blobs in the nether.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val BLACKSTONE_BLOBS = registerConfiguredFeature(
            "blackstone_blobs",
            Feature.REPLACE_BLOBS,
            ReplaceSphereConfiguration(
                Blocks.NETHERRACK.defaultBlockState(), // targetState
                Blocks.BLACKSTONE.defaultBlockState(), // replaceState
                UniformInt.of(3, 7) // radius // (1)!
            )
        )
    
    }
    ```

    1. Random radius between 3 and 7.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val BLACKSTONE_BLOBS = placedFeature("blackstone_blobs", ConfiguredFeatures.BLACKSTONE_BLOBS)
            .count(25) // (1)!
            .inSquareSpread() // (2)!
            .modifier(PlacementUtils.FULL_RANGE) // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```

    1. 25 tries to place the blobs per chunk.
    2. Randomly spread the blobs horizontally.
    3. Set the y-coordinate to a random value. The static constant is equivalent to
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.top());
       ```
    4. Only place the blobs in biomes that have blackstone blobs.

=== "Json"

    ```json title="configured_feature/blackstone_blobs.json"
    {
      "type": "minecraft:replace_blobs",
      "config": {
        "target": {
          "Name": "minecraft:netherrack"
        },
        "state": {
          "Name": "minecraft:blackstone"
        },
        "radius": {
          "type": "minecraft:uniform", // (1)!
          "value": {
            "max_inclusive": 7,
            "min_inclusive": 3
          }
        }
      }
    }
    ```

    1. Random radius between 3 and 7.
 
    ```json title="placed_feature/blackstone_blobs.json"
    {
      "feature": "minecraft:blackstone_blobs",
      "placement": [
        {
          "type": "minecraft:count",
          "count": 25 // (1)!
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:height_range", // (3)!
          "height": {
            "type": "minecraft:uniform",
            "max_inclusive": {
              "below_top": 0
            },
            "min_inclusive": {
              "above_bottom": 0
            }
          }
        },
        {
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. 25 tries to place the blobs per chunk.
    2. Randomly spread the blobs horizontally.
    3. Set the y-coordinate to a random value.
    4. Only place the blobs in biomes that have blackstone blobs.

## Result

![Example](https://i.imgur.com/dVus6n5.gif)