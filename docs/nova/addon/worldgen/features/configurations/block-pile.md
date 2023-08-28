# Block pile feature

The `block_pile` can be used to place piles of blocks (for example hay/melons in villages) in the world.

## Configuration

A block pile feature only has the `state_provider` option:

| Option           | Type                                                           | Description                          |
|------------------|----------------------------------------------------------------|--------------------------------------|
| `state_provider` | A  [`BlockStateProvider`](../../types/block-state-provider.md) | The block state to use for the pile. |

In code, the `BlockPileConfiguration` class is used to configure the feature.

## Example

As an example, here's the placed and configured feature used to place piles of hay bales in villages.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val PILE_HAY = registerConfiguredFeature(
            "pile_hay",
            Feature.BLOCK_PILE,
            BlockPileConfiguration(RotatedBlockProvider(Blocks.HAY_BLOCK)) // (1)!
        )
    
    }
    ```

    1. Randomly rotate the hay bales.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures: FeatureRegistry by ExampleAddon.registry {
    
        val PILE_HAY = placedFeature("pile_hay", ConfiguredFeatures.PILE_HAY).register() // (1)!
    
    }
    ```

     1. The feature does all the location resolving itself, so no extra `PlacementModifiers` are needed.

=== "Json"

    ```json title="configured_feature/pile_hay.json"
    {
      "type": "minecraft:block_pile",
      "config": {
        "state_provider": {
          "type": "minecraft:rotated_block_provider",
          "state": {
            "Name": "minecraft:hay_block",
            "Properties": {
              "axis": "y" // (1)!
            }
          }
        }
      }
    }
    ```

    1. Randomly rotate the hay bales.

    ```json title="placed_feature/pile_hay.json"
    {
      "feature": "minecraft:pile_hay",
      "placement": [] // (1)!
    }
    ```

    1. The feature does all the location resolving itself.

## Result

=== "Alone"

    <p class="text-center">
      <img src="https://i.imgur.com/kI3yAnZ.png" width="50%" alt="Example"/>
    </p>

=== "Naturally generated"

    <p class="text-center">
      <img src="https://i.imgur.com/gnOfX3E.png" width="50%" alt="Example"/>
    </p>