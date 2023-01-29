# Huge fungus feature

The `huge_fungus` feature can be used to place huge fungi in the world (used for warped and crimson forests in vanilla).

## Configuration

The `huge_fungus` feature has the following configuration options:

| Option                                    | Type                                   | Description                                                                                       |
|-------------------------------------------|----------------------------------------|---------------------------------------------------------------------------------------------------|
| `hat_state`                               | A [`BlockState`](../../block-state.md) | The block state to use for the hat of the fungus.                                                 |
| `decor_state`                             | A `BlockState`                         | The block state to randomly place under the hat as decoration. (For example shroomlight)          |
| `stem_state`                              | A `BlockState`                         | The block state to use for the stem of the fungus.                                                |
| `valid_base_block`                        | A `BlockState`                         | The block state that needs to be present below the fungus.                                        |
| `planted` (optional, defaults to `false`) | A `boolean`                            | If set to `false`, can only replace `PLANT` material blocks and doesn't drop items when replaced. |

In code, the `HugeFungusConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature for the warped fungus:

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val WARPED_FUNGUS = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "warped_fungus",
        Feature.HUGE_FUNGUS,
        HugeFungusConfiguration(
            Blocks.WARPED_NYLIUM.defaultBlockState(), // (1)!
            Blocks.WARPED_STEM.defaultBlockState(), // (2)!
            Blocks.WARPED_WART_BLOCK.defaultBlockState(), // (3)!
            Blocks.SHROOMLIGHT.defaultBlockState(), // (4)!
            false // (5)!
        )
    )
    ```

    1. Only place the fungus on warped nylium.
    2. The stem of the fungus.
    3. The hat of the fungus.
    4. Randomly placed shroomlight under the hat.
    5. The fungus is automatically generated, so it shouldn't drop items when another fungus grows into it.

    ```kotlin title="PlacedFeatures.kt"
    val WARPED_FUNGUS = FeatureRegistry.registerPlacedFeature(
        Machines,
        "warped_fungus",
        ConfiguredFeatures.WARPED_FUNGUS,
        listOf(
            CountOnEveryLayerPlacement.of(8),
            BiomeFilter.biome()
        )
    )
    ```

=== "Json"

    ```json title="configured_feature/warped_fungus.json"
    {
      "type": "minecraft:huge_fungus",
      "config": {
        "decor_state": {
          "Name": "minecraft:shroomlight" // (1)!
        },
        "hat_state": {
          "Name": "minecraft:warped_wart_block"
        },
        "stem_state": {
          "Name": "minecraft:warped_stem",
          "Properties": {
            "axis": "y"
          }
        },
        "valid_base_block": {
          "Name": "minecraft:warped_nylium" // (2)!
        },
        "planted": false // (3)!
      }
    }
    ```

    1. Randomly placed shroomlight under the hat.
    2. Only place the fungus on warped nylium.
    3. The fungus is automatically generated, so it shouldn't drop items when another fungus grows into it.

    ```json title="placed_feature/warped_fungi.json"
    {
      "feature": "minecraft:warped_fungus",
      "placement": [
        {
          "type": "minecraft:count_on_every_layer",
          "count": 8
        },
        {
          "type": "minecraft:biome"
        }
      ]
    }
    ```

![Example](https://i.imgur.com/s7lDy1U.jpeg)