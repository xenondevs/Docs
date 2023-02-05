# Seagrass feature

The `seagrass` feature allows you to generate seagrass in water.

## Configuration

The `seagrass` feature only has the `probability` option (`float` in the range $[0.0;1.0)$), which determines the chance
of seagrass being generated.

In code, the `ProbabilityFeatureConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature of seagrass in the warm ocean biome.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val SEAGRASS_TALL = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "seagrass_tall",
        Feature.SEAGRASS,
        ProbabilityFeatureConfiguration(0.3f)
    )
    ```
    
    ```kotlin title="PlacedFeatures.kt"
    val SEAGRASS_TALL = FeatureRegistry.registerPlacedFeature(
        Machines,
        "seagrass_tall",
        ConfiguredFeatures.SEAGRASS_TALL,
        listOf(
            InSquarePlacement.spread(), // (1)!
            PlacementUtils.HEIGHTMAP_TOP_SOLID, // (2)!
            CountPlacement.of(80), // (3)!
            BiomeFilter.biome() // (4)!
        )
    )
    ```
    
    1. Randomly offset the placement horizontally.
    2. Set y-coordinate to the ocean floor. This static constant is equivalent to
       ```kotlin
       HeightmapPlacement.onHeightmap(Heightmap.Types.OCEAN_FLOOR_WG)
       ```
    3. Place 80 seagrass per chunk.
    4. Only place in the warm ocean biome.

=== "Json"

    ```json title="configured_feature/seagrass_tall.json"
    {
      "type": "minecraft:seagrass",
      "config": {
        "probability": 0.8
      }
    }
    ```

    ```json title="placed_feature/seagrass_deep_warm.json"
    {
      "feature": "minecraft:seagrass_tall",
      "placement": [
        {
          "type": "minecraft:in_square" // (1)!
        },
        {
          "type": "minecraft:heightmap",
          "heightmap": "OCEAN_FLOOR_WG" // (2)!
        },
        {
          "type": "minecraft:count", // (3)!
          "count": 80
        },
        {
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```
    
    1. Randomly offset the placement horizontally.
    2. Set y-coordinate to the ocean floor.
    3. Place 80 seagrass per chunk.
    4. Only place in the warm ocean biome.