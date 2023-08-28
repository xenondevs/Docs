# Pointed dripstone feature

The `pointed_dripstone` feature can be used to add pointed dripstone to the world.

## Configuration

The `pointed_dripstone` feature has the following configuration options:

| Option                                                               | Type                                | Description                                                     |
|----------------------------------------------------------------------|-------------------------------------|-----------------------------------------------------------------|
| `chance_of_taller_dripstone` (optional in Json, defaults to `0.2`)   | A `float` in the range $[0.0;1.0]$. | Determines the chance of a dripstone being taller than 1 block. |
| `chance_of_directional_spread` (optional in Json, defaults to `0.7`) | A `float` in the range $[0.0;1.0]$. | Determines the chance of a dripstone spreading horizontally.    |
| `chance_of_spread_radius2` (optional in Json, defaults to `0.5`)     | A `float` in the range $[0.0;1.0]$. | Determines the chance of a dripstone spreading 2 blocks away.   |
| `chance_of_spread_radius3` (optional in Json, defaults to `0.5`)     | A `float` in the range $[0.0;1.0]$. | Determines the chance of a dripstone spreading 3 blocks away.   |

In code, the `PointedDripstoneConfiguration` class is used to configure the feature.

## Example

Minecraft uses a [`simple_random_selector`](simple-random-selector.md) feature to actually place pointed dripstone. Here's 
one of the features used to place upwards pointing dripstone.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val POINTED_DRIPSTONE = registerConfiguredFeature(
            "pointed_dripstone",
            Feature.POINTED_DRIPSTONE,
            PointedDripstoneConfiguration(
                0.2F, // chance_of_taller_dripstone
                0.7F, // chance_of_directional_spread
                0.5F, // chance_of_spread_radius2
                0.5F  // chance_of_spread_radius3
            )
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val POINTED_DRIPSTONE = placedFeature("pointed_dripstone", ConfiguredFeatures.POINTED_DRIPSTONE)
            .environmentScan( // (1)!
                Direction.DOWN,
                BlockPredicate.solid(),
                BlockPredicate.ONLY_IN_AIR_OR_WATER_PREDICATE, // (2)!
                12 // max_steps
            )
            .randomVerticalOffset(1) // (3)!
            .register()
    
    }
    ```

    1. Searches downwards for a solid block.
    2. Only place the dripstone if the block below is air or water. The static constant is equivalent to
       ```kotlin
       BlockPredicate.matchesBlocks(Blocks.AIR, Blocks.WATER) 
       ```
    3. Makes sure to place the dripstone on top of the solid block.

=== "Json"

    ```json title="configured_feature/pointed_dripstone.json"
    {
      "type": "minecraft:pointed_dripstone",
      "config": {
        "chance_of_taller_dripstone": 0.2,
        "chance_of_directional_spread": 0.7,
        "chance_of_spread_radius2": 0.5,
        "chance_of_spread_radius3": 0.5
      }
    }
    ```

    The placed feature is also located in the random selector:

    ```json title="placed_feature/pointed_dripstone.json"
    {
      "feature": "minecraft:pointed_dripstone",
      "placement": [
        {
          "type": "minecraft:environment_scan", // (1)!
          "allowed_search_condition": {
            "type": "minecraft:matching_blocks",
            "blocks": [
              "minecraft:air",
              "minecraft:water"
            ]
          },
          "direction_of_search": "down",
          "max_steps": 12,
          "target_condition": {
            "type": "minecraft:solid" 
          }
        },
        {
          "type": "minecraft:random_offset", // (2)!
          "xz_spread": 0,
          "y_spread": 1
        }
      ]
    }
    ```

    1. Searches downwards for a solid block.
    2. Makes sure to place the dripstone on top of the solid block.

## Result

![Example](https://i.imgur.com/DqCS6yo.png)