# Random patch feature

The `random_patch` feature can be used to place a feature in a random pattern multiple times. It's mostly used for
vegetation and even has 2 more features for flowers: `flower` and `no_bonemeal_flower`. Their configuration is the same
as the`random_patch` feature, but `flower` features will also be used when applying bonemeal to grass blocks. `no_bonemeal_flower`
only exists to make distinguishing it from other `random_patch` features easier.

## Configuration

The following configuration options are available:

| Option                                          | Type                                                                                                | Description                                                     |
|-------------------------------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| `tries` (optional in Json, defaults to `128`)   | A positive `int`.                                                                                   | The amount of times the feature will try to generate.           |
| `xz_spread` (optional in Json, defaults to `7`) | A positive `int`.                                                                                   | The maximum horizontal distance from the center of the feature. |
| `y_spread` (optional in Json, defaults to `3`)  | A positive `int`.                                                                                   | The maximum vertical distance from the center of the feature.   |
| `feature`                                       | The placed feature (in Json, this can also be the id of the placed feature if registered elsewhere) | The placed feature to generate.                                 |

In code, the `RandomPatchConfiguration` class is used to configure the feature.

## Example

As an example, here's the random patch used to generate dead bushes in the badlands biome:

=== "Kotlin"

    Minecraft offers a few util functions in the `FeatureUtils` class to make the creation of the `RandomPatchConfiguration` easier.
    
    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val PATCH_DEAD_BUSH = registerConfiguredFeature(
            "patch_dead_bush",
            Feature.RANDOM_PATCH,
            FeatureUtils.simpleRandomPatchConfiguration( // (1)!
                4, // tries
                PlacementUtils.onlyWhenEmpty( // (2)!
                    Feature.SIMPLE_BLOCK,
                    SimpleBlockConfiguration(BlockStateProvider.simple(Blocks.DEAD_BUSH)) // (3)!
                )
            )
        )
    
    }
    ```
    
    1. The `simpleRandomPatchConfiguration` function creates a `RandomPatchConfiguration` with the given tries and placed feature.
       `xz_spread` and `y_spread` are set to `7` and `3` respectively.
    2. The `onlyWhenEmpty` function creates an [inlined `PlacedFeature`](../../placed-feature#inlined) that only places the feature when the block at the position is air.
    3. Place single dead bushes.
    
    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val PATCH_DEAD_BUSH = placedFeature("patch_dead_bush", ConfiguredFeatures.PATCH_DEAD_BUSH)
            .count(20) // (1)!
            .inSquareSpread() // (2)!
            .moveToWorldSurface() // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```
    
    1. 20 tries to generate the feature.
    2. Spread the feature horizontally.
    3. Set the y-coordinate to the world surface. This call is equivalent to
       ```kotlin
       HeightmapPlacement.onHeightmap(Heightmap.Types.WORLD_SURFACE_WG)
       ```
    4. Make sure that the feature only generates if the position hasn't moved outside the biome that contains dead bushes.

=== "Json"

    ```json title="configured_feature/patch_dead_bush.json"
    {
      "type": "minecraft:random_patch",
      "config": {
        "feature": { // (1)!
          "feature": { // (2)!
            "type": "minecraft:simple_block",
            "config": {
              "to_place": {
                "type": "minecraft:simple_state_provider",
                "state": {
                  "Name": "minecraft:dead_bush"
                }
              }
            }
          },
          "placement": [
            {
              "type": "minecraft:block_predicate_filter",
              "predicate": {
                "type": "minecraft:matching_blocks",
                "blocks": "minecraft:air"
              }
            }
          ]
        },
        "tries": 4,
        "xz_spread": 7,
        "y_spread": 3
      }
    }
    ```

    1. The placed feature to generate. Can also be the id of a placed feature that was configured elsewhere.
    2. The feature's configuration. Can also be the id of a configured feature.

    ```json title="placed_feature/patch_dead_bush_badlands.json"
    {
      "feature": "minecraft:patch_dead_bush",
      "placement": [
        {
          "type": "minecraft:count",
          "count": 20 // (1)!
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:heightmap",
          "heightmap": "WORLD_SURFACE_WG" // (3)!
        },
        {
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. 20 tries to generate the feature.
    2. Spread the feature horizontally.
    3. Set the y-coordinate to the world surface.
    4. Make sure that the feature only generates if the position hasn't moved outside the biome that contains dead bushes.

## Result

<p class="text-center">
  <img src="https://i.imgur.com/cPaH1UW.png" width="90%" alt="Example"/>
</p>