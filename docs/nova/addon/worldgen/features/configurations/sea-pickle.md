# Sea pickle feature

As the name suggests, the `sea_pickle` feature generates sea pickles in the ocean.

## Configuration

The `sea_pickle` feature only has a `count` [`IntProvider`](../placed-feature.md#int-providers) option. It determines the
max amount of sea pickles per placement.

In code, the `CountConfiguration` class is used to configure the feature.

## Example

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val SEA_PICKLE = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "sea_pickle",
        Feature.SEA_PICKLE,
        CountConfiguration(20)
    )
    ```

    ```kotlin title="PlacedFeatures.kt"
    val SEA_PICKLE = FeatureRegistry.registerPlacedFeature(
        Machines,
        "sea_pickle",
        ConfiguredFeatures.SEA_PICKLE,
        listOf(
            RarityFilter.onAverageOnceEvery(16), // (1)!
            InSquarePlacement.spread(), // (2)!
            PlacementUtils.HEIGHTMAP_TOP_SOLID, // (3)!
            BiomeFilter.biome() // (4)!
        )
    )
    ```

    1. Place sea pickles in every 16th chunk.
    2. Randomly offset the placement horizontally.
    3. Set y-coordinate to the ocean floor. This static constant is equivalent to
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