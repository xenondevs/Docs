# Twisting vines Feature

!!! warning "Hardcoded block check"

    This feature has a hardcoded check for the block below the feature being `netherrack, `warped_nylium` or `warped_wart_block` and will not work on other blocks

The `twisting_vines` can be used to generate twisting vines in the world.

## Configuration

The `twisting_vines` feature has the following configuration options:

| Option          | Type             | Description                                                                              |
|-----------------|------------------|------------------------------------------------------------------------------------------|
| `spread_width`  | A positive `int` | Specifies the spread width of the twisting vines. Max width is `spread_width * 2 + 1`    |
| `spread_height` | A positive `int` | Specifies the spread height of the twisting vines. Max height is `spread_height * 2 + 1` |
| `max_height`    | A positive `int` | Specifies the maximum height of the twisting vines. Actual height is `max_height * 2`    |

In code, the `TwistingVinesConfig` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature to generate twisting vines in the nether:

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val TWISTING_VINES = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "twisting_vines",
        Feature.TWISTING_VINES,
        TwistingVinesConfig(
            8, // spreadWidth
            4, // spreadHeight
            8 // maxHeight
        )
    )
    ```
    
    ```kotlin title="PlacedFeatures.kt"
    val TWISTING_VINES = FeatureRegistry.registerPlacedFeature(
        Machines,
        "twisting_vines",
        Configurations.TWISTING_VINES,
        listOf(
            CountPlacement.of(10), // (1)!
            InSquarePlacement.spread(), // (2)!
            PlacementUtils.FULL_RANGE, // (3)!
            BiomeFilter.biome() // (4)!
        )
    )
    ```
    
    1. 10 twisting vines per chunk.
    2. Spread the vines horizontally.
    3. Set the y-coordinate to a random value. The static constant is equivalent to
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.top());
       ```
    4. Only place the vines if the location hasn't moved outside the warped forest biome.

=== "Json"

    ```json title="configured_features/twisting_vines.json"
    {
       "type": "minecraft:twisting_vines",
       "config": {
          "spread_width": 8,
          "spread_height": 4,
          "max_height": 8
       }
    }
    ```
    
    ```json title="placed_features/twisting_vines.json"
    {
       "feature": "minecraft:twisting_vines",
       "placement": [
          {
             "type": "minecraft:count", // (1)!
             "count": 10
          },
          {
             "type": "minecraft:in_square" // (2)!
          },
          {
             "type": "minecraft:height_range", // (3)!
             "height": {
                "type": "minecraft:uniform",
                "max_inclusive": {
                   "below_top": 0
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

    1. 10 twisting vines per chunk.
    2. Spread the vines horizontally.
    3. Set the y-coordinate to a random value. The static constant is equivalent to
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.top());
       ```
    4. Only place the vines if the location hasn't moved outside the warped forest biome.

## Result

=== "Alone"

    <p class="text-center">
      <img src="https://i.imgur.com/i8gaAoS.png" width="30%" alt="Example"/>
    </p>

=== "Naturally generated"

    <p class="text-center">
      <img src="https://i.imgur.com/xkI1urz.gif" alt="Example"/>
    </p>