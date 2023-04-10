# Huge mushroom features

The `huge_brown_mushroom ` and `huge_red_mushroom` features can be used to add huge mushrooms to a biome.

## Configuration

| Option                                             | Type                                                          | Description                                               |
|----------------------------------------------------|---------------------------------------------------------------|-----------------------------------------------------------|
| `cap_provider`                                     | A [`BlockStateProvider`](../../types/block-state-provider.md) | Determines the block to use for the cap of the mushroom.  |
| `stem_provider`                                    | A `BlockStateProvider`                                        | Determines the block to use for the stem of the mushroom. |
| `foliage_radius` (optional in Json, defaults to 2) | An `int`                                                      | Determines the radius of the cap.                         |

In code, the `HugeMushroomFeatureConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature for the default huge red mushroom

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val HUGE_RED_MUSHROOM = registerConfiguredFeature(
            "huge_red_mushroom",
            Feature.HUGE_RED_MUSHROOM,
            HugeMushroomFeatureConfiguration(
                BlockStateProvider.simple(Blocks.RED_MUSHROOM_BLOCK.defaultBlockState().setValue(HugeMushroomBlock.DOWN, false) as BlockState), // (1)!
                BlockStateProvider.simple((Blocks.MUSHROOM_STEM.defaultBlockState().setValue(HugeMushroomBlock.UP, false) as BlockState).setValue(HugeMushroomBlock.DOWN, false) as BlockState), // (2)!
                2 // (3)!
            )
        )
    
    }
    ```

    1. Use a mushroom block with the `down` property set to `false` as the cap.
    2. Use a mushroom stem with the `up` and `down` properties set to `false` as the stem.
    3. Use a radius of 2 for the cap.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val HUGE_RED_MUSHROOM = placedFeature("huge_red_mushroom", ConfiguredFeatures.HUGE_RED_MUSHROOM).register()
    
    }
    ```

=== "Json"

    ```json title="configured_feature/huge_red_mushroom.json"
    {
      "type": "minecraft:huge_red_mushroom",
      "config": {
        "cap_provider": {
          "type": "minecraft:simple_state_provider",
          "state": {
            "Name": "minecraft:red_mushroom_block",
            "Properties": {
              "down": "false",
              "east": "true",
              "north": "true",
              "south": "true",
              "up": "true",
              "west": "true"
            }
          }
        },
        "stem_provider": {
          "type": "minecraft:simple_state_provider",
          "state": {
            "Name": "minecraft:mushroom_stem",
            "Properties": {
              "down": "false",
              "east": "true",
              "north": "true",
              "south": "true",
              "up": "false",
              "west": "true"
            }
          }
        },  
        "foliage_radius": 2
      }
    }
    ```

    ```json title="placed_feature/huge_red_mushroom.json"
    {
      "feature": {
      "feature": "minecraft:huge_red_mushroom",
      "placement": []
    }
    ```

## Result

=== "Alone"

    <p class="text-center">
      <img src="https://i.imgur.com/ngPLJK8.gif" width="50%" alt="Example"/>
    </p>

=== "Naturally generated"

    <p class="text-center">
      <img src="https://i.imgur.com/uBDxTqV.gif" width="50%" alt="Example"/>
    </p>