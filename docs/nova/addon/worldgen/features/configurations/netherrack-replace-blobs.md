# Replace blobs feature

The `replace_blobs` feature can be used to replace specific blobs with a blob of a different block. Although
the name suggests that it only works with netherrack, it can be used with any block.

## Configuration

The `replace_blobs` feature has the following configuration options:

| Option   | Type                                                                               | Description                                 |
|----------|------------------------------------------------------------------------------------|---------------------------------------------|
| `target` | A [`BlockState`](../../block-state.md)                                             | The block state to replace.                 |
| `state`  | A `BlockState`                                                                     | The block state to replace the target with. |
| `radius` | An [`IntProvider`](../placed-feature.md#int-providers) whose value is in $[0;12]$. | The radius of the blob.                     |

In code, the `ReplaceSphereConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature for blackstone blobs in the nether.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val BLACKSTONE_BLOBS = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "blackstone_blobs",
        Feature.REPLACE_BLOBS,
        ReplaceSphereConfiguration(
            Blocks.NETHERRACK.defaultBlockState(), // targetState
            Blocks.BLACKSTONE.defaultBlockState(), // replaceState
            UniformInt.of(3, 7) // radius // (1)!
        )
    )
    ```

    1. Random radius between 3 and 7.

    ```kotlin title="PlacedFeatures.kt"
    val BLACKSTONE_BLOBS = FeatureRegistry.registerPlacedFeature(
        Machines,
        "blackstone_blobs",
        ConfiguredFeatures.BLACKSTONE_BLOBS,
        listOf(
            CountPlacement.of(25), // (1)!
            InSquarePlacement.spread(), // (2)!
            PlacementUtils.FULL_RANGE, // (3)!
            BiomeFilter.biome() // (4)!
        )
    )
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

![Example](https://i.imgur.com/h7FQVkv.jpeg)