# Simple block feature

The `simple_block` feature allows you to randomly place blocks in the world.

## Configuration

The `simple_block` feature has a single option, `to_place` which is a [`BlockStateProvider`](../../types/block-state-provider.md)
that specifies which block states should be placed.

In code, the `SimpleBlockConfiguration` class is used to configure the feature.

## Example

As an example, here's the feature used to randomly place spore blossoms.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SPORE_BLOSSOM = registerConfiguredFeature(
            "spore_blossom",
            Feature.SIMPLE_BLOCK,
            SimpleBlockConfiguration(BlockStateProvider.simple(Blocks.SPORE_BLOSSOM))
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SPORE_BLOSSOM = placedFeature("spore_blossom", ConfiguredFeatures.SPORE_BLOSSOM)
            .count(25) // (1)!
            .inSquareSpread() // (2)!
            .inYWorldBounds() // (3)!
            .environmentScan(Direction.UP, BlockPredicate.solid(), BlockPredicate.ONLY_IN_AIR_PREDICATE, 12) // (4)!
            .randomVerticalOffset(-1) // (5)!
            .biomeFilter() // (6)!
            .register()
    
    }
    ```

    1. 25 attempts to place a spore blossom per chunk.
    2. Randomly offset the location horizontally.
    3. Set the y-coordinate to a random value up to 256. The call is equivalent to
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(256));
       ```
    4. Search up to 12 blocks above the randomly selected location for a solid block.
    5. Offset the location by -1 vertically.
    6. Only place spore blossoms in biomes that have the `minecraft:spore_blossom` feature.

=== "Json"

    ```json title="configured_feature/spore_blossom.json"
    {
      "type": "minecraft:simple_block",
      "config": {
        "to_place": {
          "type": "minecraft:simple_state_provider",
          "state": {
            "Name": "minecraft:spore_blossom"
          }
        }
      }
    }
    ```
    
    ```json title="placed_feature/spore_blossom.json"
    {
      "feature": "minecraft:spore_blossom",
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
              "absolute": 256
            },
            "min_inclusive": {
              "above_bottom": 0
            }
          }
        },
        {
          "type": "minecraft:environment_scan", // (4)!
          "allowed_search_condition": {
            "type": "minecraft:matching_blocks",
            "blocks": "minecraft:air"
          },
          "direction_of_search": "up",
          "max_steps": 12,
          "target_condition": {
            "type": "minecraft:solid"
          }
        },
        {
          "type": "minecraft:random_offset", // (5)!
          "xz_spread": 0,
          "y_spread": -1
        },
        {
          "type": "minecraft:biome" // (6)!
        }
      ]
    }
    ```

    1. 25 attempts to place a spore blossom per chunk.
    2. Randomly offset the location horizontally.
    3. Set the y-coordinate to a random value up to 256.
    4. Search up to 12 blocks above the randomly selected location for a solid block.
    5. Offset the location by -1 vertically.
    6. Only place spore blossoms in biomes that have the `minecraft:spore_blossom` feature.

![Example](https://i.imgur.com/rFXdXU2.png)