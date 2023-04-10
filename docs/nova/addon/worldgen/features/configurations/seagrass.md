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
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SEAGRASS_TALL = registerConfiguredFeature(
            "seagrass_tall",
            Feature.SEAGRASS,
            ProbabilityFeatureConfiguration(0.3f)
        )
    
    }
    ```
    
    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SEAGRASS_TALL = placedFeature("seagrass_tall", ConfiguredFeatures.SEAGRASS_TALL)
            .inSquareSpread() // (1)!
            .moveToTopSolid() // (2)!
            .count(80) // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```
    
    1. Randomly offset the placement horizontally.
    2. Set y-coordinate to the ocean floor. This call is equivalent to
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