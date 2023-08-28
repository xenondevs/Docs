# Sea pickle feature

As the name suggests, the `sea_pickle` feature generates sea pickles in the ocean.

## Configuration

The `sea_pickle` feature only has a `count` [`IntProvider`](../../types/number-provider.md#intprovider) option. It determines the
max amount of sea pickles per placement.

In code, the `CountConfiguration` class is used to configure the feature.

## Example

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SEA_PICKLE = registerConfiguredFeature(
            "sea_pickle",
            Feature.SEA_PICKLE,
            CountConfiguration(20)
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SEA_PICKLE = placedFeature("sea_pickle", ConfiguredFeatures.SEA_PICKLE)
            .rarityFilter(16) // (1)!
            .inSquareSpread() // (2)!
            .moveToTopSolid() // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```

    1. Place sea pickles in every 16th chunk.
    2. Randomly offset the placement horizontally.
    3. Set y-coordinate to the ocean floor. This call is equivalent to
       ```kotlin
       HeightmapPlacement.onHeightmap(Heightmap.Types.OCEAN_FLOOR_WG)
       ```
    4. Only place in the warm ocean biome.

=== "Json"

    ```json title="configured_feature/sea_pickle.json"
    {
      "type": "minecraft:sea_pickle",
      "config": {
        "count": 20
      }
    }
    ```

    ```json title="placed_feature/sea_pickle.json"
    {
      "feature": "minecraft:sea_pickle",
      "placement": [
        {
          "type": "minecraft:rarity_filter",
          "chance": 16 // (1)!
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:heightmap",
          "heightmap": "OCEAN_FLOOR_WG" // (3)!
        },
        {
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. Place sea pickles in every 16th chunk.
    2. Randomly offset the placement horizontally.
    3. Set y-coordinate to the ocean floor.
    4. Only place in the warm ocean biome.

![Example](https://i.imgur.com/0BTepnm.jpeg)