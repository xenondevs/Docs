# Basalt columns feature

The `basalt_columns` feature allows you to add basalt columns to the world.

## Configuration

The `basalt_columns` feature has the following configuration options:

| Option   | Type                                                                                             | Description                                                                                        |
|----------|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `reach`  | An [`IntProvider`](../../types/number-provider.md#intprovider). (Range limit in Json is $[0;3]$) | Determines the maximum radius from the center of the current column cluster.                       |
| `height` | An `IntProvider`. (Range limit in Json is $[1;10]$)                                              | Determines the maximum height of the current column cluster. (Actual height is $\text{height} + 1$ |

In code, the configuration is done via the `ColumnFeatureConfiguration` class.

## Example

As an example, here's the configured and placed feature for the large basalt columns in the nether.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val LARGE_BASALT_COLUMNS = registerConfiguredFeature(
            "large_basalt_columns",
            Feature.BASALT_COLUMNS,
            ColumnFeatureConfiguration(UniformInt.of(2, 3), UniformInt.of(5, 10)) // (1)!
        )
    
    }
    ```

    1. Randomly chooses a radius between 2 and 3 and a height between 5 and 10.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures: FeatureRegistry by ExampleAddon.registry {
    
        val LARGE_BASALT_COLUMNS = placedFeature("large_basalt_columns", ConfiguredFeatures.LARGE_BASALT_COLUMNS)
            .countOnEveryLayer(2) // (1)!
            .biomeFilter() // (2)!
            .register()
    
    }
    ```

    1. Spreads the basalt columns to multiple layers.
    2. Only place the columns in biomes that have basalt.

=== "Json"

    ```json title="configured_feature/large_basalt_columns.json"
    {
      "type": "minecraft:basalt_columns",
      "config": {
        "reach": { // (1)!
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 3,
            "min_inclusive": 2
          }
        },
        "height": { // (2)!
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 10,
            "min_inclusive": 5
          }
        }
      }
    }
    ```

    1. Randomly chooses a radius between 2 and 3.
    2. Randomly chooses a height between 5 and 10.

    ```json title="placed_feature/large_basalt_columns.json"
    {
      "feature": "minecraft:large_basalt_columns",
      "placement": [
        {
          "type": "minecraft:count_on_every_layer", // (1)!
          "count": 2
        },
        {
          "type": "minecraft:biome" // (2)!
        }
      ]
    }
    ```

    1. Spreads the basalt columns to multiple layers.
    2. Only place the columns in biomes that have basalt.

## Result

<p class="text-center">
  <img src="https://i.imgur.com/29HVOlq.gif" width="40%" alt="Example"/>
</p>