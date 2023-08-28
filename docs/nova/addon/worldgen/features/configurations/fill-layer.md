# Fill layer feature

The `fill_layer` feature can be used to fill an entire 16x16 chunk area with a single block.

## Configuration

The following configuration options are available:


| Option   | Type                                           | Description                                                         |
|----------|------------------------------------------------|---------------------------------------------------------------------|
| `height` | An `int`. (Range limit in Json is $[0;4064 ]$) | The height of the layer to fill (starting at the min build height). |
| `state`  | A [`BlockState`](../../types/block-state.md)   | The block state to use for the layer.                               |

In code, the `LayerConfiguration` class is used to configure the feature.

## Example

As an example, here's a configured- and placed feature to add a layer of grass on top of a default flat world.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    @OptIn(ExperimentalWorldGen::class)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val FILL_LAYER_GRASS = registerConfiguredFeature(
            "fill_layer_grass",
            Feature.FILL_LAYER,
            LayerConfiguration(4, Blocks.GRASS.defaultBlockState()) // (1)!
        )
    
    }
    ```

    1. Add a layer of grass at height 4.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val FILL_LAYER_GRASS = placedFeature("fill_layer_grass", ConfiguredFeatures.FILL_LAYER_GRASS).register()
    
    }
    ```

=== "Json"

    ```json title="configured_feature/fill_layer_grass.json"
    {
      "height": 4,
      "state": {
        "Name": "minecraft:grass"
      }
    }
    ```
    
    ```json title="placed_feature/fill_layer_grass.json"
    {
      "feature": "minecraft:fill_layer_grass",
      "placement": []
    }
    ```