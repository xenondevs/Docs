# Nether forest vegetation feature

!!! warning "Hardcoded block check"

    This feature has a hardcoded check for the surface block being `nylium` and will not work on other blocks

The `nether_forest_vegetation` feature is a feature that randomly spreads a specific block on the surface.

## Configuration

The nether forest vegetation feature has the following configuration options:

| Option           | Type                                                           | Description                                         |
|------------------|----------------------------------------------------------------|-----------------------------------------------------|
| `state_provider` | A [`BlockStateProvider`](../../types/block-state-provider.md). | The block state to use for the vegetation.          |
| `spread_width`   | A positive `int`.                                              | The width of the area to spread the vegetation in.  |
| `spread_height`  | A positive `int`.                                              | The height of the area to spread the vegetation in. |

In code, the `NetherForestVegetationConfig` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature to spread nether sprouts in the nether forest biomes.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val NETHER_SPROUTS = registerConfiguredFeature(
            "nether_sprouts",
            Feature.NETHER_FOREST_VEGETATION,
            NetherForestVegetationConfig(
                BlockStateProvider.simple(Blocks.NETHER_SPROUTS), // block used for the vegetation
                8, // spreadWidth
                4 // spreadHeight
            )
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val NETHER_SPROUTS = placedFeature("nether_sprouts", ConfiguredFeatures.NETHER_SPROUTS)
            .countOnEveryLayer(4) // (1)!
            .biomeFilter() // (2)!
            .register()
    
    }
    ```

    1. Make sure to place the nether sprouts on every layer if multiple exist in the biome.
    2. Only place the sprouts in the nether forest biomes.

=== "Json"

    ```json title="configured_feature/nether_sprouts.json"
    {
      "type": "minecraft:nether_forest_vegetation",
      "config": {
        "state_provider": {
          "type": "minecraft:simple_state_provider",
          "state": {
            "Name": "minecraft:nether_sprouts"
          }
        },
        "spread_height": 4,
        "spread_width": 8
      }
    }
    ```
    
    ```json title="placed_feature/nether_sprouts.json"
    {
      "feature": "minecraft:nether_sprouts",
      "placement": [
        {
          "type": "minecraft:count_on_every_layer", // (1)!
          "count": 4
        },
        {
          "type": "minecraft:biome" // (2)!
        }
      ]
    }
    ```

    1. Make sure to place the nether sprouts on every layer if multiple exist in the biome.
    2. Only place the sprouts in the nether forest biomes.