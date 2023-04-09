# Bamboo feature

The `bamboo` feature is used to add bamboo to the world.

## Configuration

Bamboo features can only be configured to have a specific probability of spawning a podzol disk under the bamboo.

| Option        | Type                                | Description                                                            |
|---------------|-------------------------------------|------------------------------------------------------------------------|
| `probability` | A `float` in the range $[0.0;1.0]$. | Determines the probability of spawning a podzol disk under the bamboo. |

In code, the configuration is done via the `ProbabilityFeatureConfiguration` class.

## Example

As an example, here's the configured and placed feature for the bamboo in the jungle.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val BAMBOO_SOME_PODZOL = registerConfiguredFeature(
            "bamboo_some_podzol",
            Feature.BAMBOO,
            ProbabilityFeatureConfiguration(0.2f) // (1)!
        )
    
    }
    ```

    1. Gives a $20\%$ chance of spawning a podzol disk under the bamboo.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures: FeatureRegistry by ExampleAddon.registry {
    
        val BAMBOO_SOME_PODZOL = placedFeature("bamboo_some_podzol", ConfiguredFeatures.BAMBOO_SOME_PODZOL)
            .noiseBasedCount(170, 80.0, 0.3) // (1)!
            .inSquareSpread() // (2)!
            .moveToWorldSurface() // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```

    1. Use noise to determine bamboo amount.   
       See [Noise-based count placement](../placed-feature.md#minecraftnoise_based_count) for more information.
    2. Spread the tries in a square.
    3. Make sure to place the bamboo on the world surface. This call is equivalent to 
       ```kotlin
       HeightmapPlacement.onHeightmap(Heightmap.Types.WORLD_SURFACE_WG)
       ```
    4. Only place the bamboo in biomes that have bamboo.

=== "Json"

    ```json title="configured_feature/bamboo_some_podzol.json"
      "type": "minecraft:bamboo",
      "config": {
        "probability": 0.2 // (1)!
      }
    ```

    1. Gives a $20\%$ chance of spawning a podzol disk under the bamboo.

    ```json title="placed_feature/bamboo.json"
    {
      "feature": "minecraft:bamboo_some_podzol",
      "placement": [
        {
          "type": "minecraft:noise_based_count", // (1)!
          "noise_factor": 80.0,
          "noise_offset": 0.3,
          "noise_to_count_ratio": 160
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

    1. Use noise to determine bamboo amount.   
       See [Noise-based count placement](../placed-feature.md#minecraftnoise_based_count) for more information.
    2. Spread the tries in a square.
    3. Make sure to place the bamboo on the world surface.
    4. Only place the bamboo in biomes that have bamboo.

## Result

<p class="text-center">
  <img src="https://i.imgur.com/SJHi7yH.png" alt="Example"/>
</p>