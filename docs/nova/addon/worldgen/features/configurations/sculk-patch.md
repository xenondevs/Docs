# Sculk patch feature

The `sculk_patch` feature allows you to generate sculk patches in the world.

## Configuration

The `sculk_patch` feature has the following configuration options:

| Option               | Type                                                                                             | Description                                        |
|----------------------|--------------------------------------------------------------------------------------------------|----------------------------------------------------|
| `charge_count`       | An `int`. (Range limit in Json is $[1;32]$)                                                      | The amount of charges the sculk patch should have. |
| `amount_per_charge`  | An `int`. (Range limit in Json is $[1;500]$)                                                     | The initial value of each charge.                  |
| `spread_attempts`    | An `int`. (Range limit in Json is $[1;64]$)                                                      | The amount of attempts to spread the sculk patch.  |
| `growth_rounds`      | An `int`. (Range limit in Json is $[0;8]$)                                                       | The amount of times to generate the patch.         |
| `spread_rounds`      | An `int`. (Range limit in Json is $[0;8]$)                                                       | The amount of times to spread the patch.           |
| `extra_rare_growths` | An [`IntProvider`](../../types/number-provider.md#intprovider). (Range limit in Json is $[0;8]$) | The amount of extra sculk shriekers to generate.   |
| `catalyst_chance`    | A `float` in the range $[0.0;1.0]$                                                               | The chance for a sculk catalyst to generate.       |

In code, the `SculkPatchConfiguration` class is used to configure the feature.

## Example

As an example, here's the default sculk patch configured- and placed feature used for the deep dark biome

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SCULK_PATCH_DEEP_DARK = registerConfiguredFeature(
            "sculk_patch_deep_dark",
            Feature.SCULK_PATCH,
            SculkPatchConfiguration(
                10, // charge_count
                32, // amount_per_charge
                64, // spread_attempts
                0, // growth_rounds
                1, // spread_rounds
                ConstantInt.of(0), // extra_rare_growths
                0.5f // catalyst_chance
            )
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SCULK_PATCH_DEEP_DARK = placedFeature("sculk_patch_deep_dark", ConfiguredFeatures.SCULK_PATCH_DEEP_DARK)
            .count(256) // (1)!
            .inSquareSpread() // (2)!
            .inYWorldBounds() // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```

    1. 256 attempts to generate sculk patches per chunk.
    2. Randomly offset the attempts horizontally.
    3. Set the y-coordinate to a random value up to 256. The call is equivalent to
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(256));
       ```
    4. Only generate in the deep dark biome.

=== "Json"

    ```json title="configured_feature/sculk_patch_deep_dark.json"
    {
      "type": "minecraft:sculk_patch",
      "config": {
        "amount_per_charge": 32,
        "catalyst_chance": 0.5,
        "charge_count": 10,
        "extra_rare_growths": 0,
        "growth_rounds": 0,
        "spread_attempts": 64,
        "spread_rounds": 1
      }
    }
    ```

    ```json title="placed_feature/sculk_patch_deep_dark.json"
    {
      "feature": "minecraft:sculk_patch_deep_dark",
      "placement": [
        {
          "type": "minecraft:count",
          "count": 256 // (1)!
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
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. 256 attempts to generate sculk patches per chunk.
    2. Randomly offset the attempts horizontally.
    3. Set the y-coordinate to a random value up to 256.
    4. Only generate in the deep dark biome.

![Example](https://i.imgur.com/HrnHSSF.png)