# Random selector feature

The `random_selector` feature can be used to randomly choose from a provided list of features to place.

## Configuration

The `random_selector` feature has the following configuration options:

| Option     | Type                                                                                                                                    | Description                                                              |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `features` | A list of [placed features](../placed-feature.md) objects (or id's inside the `feature` option in Json) and their corresponding chance. | The list of features to choose from.                                     |
| `default`  | A placed feature                                                                                                                        | The default feature to place if none of the provided features got picked |

In code, the `RandomFeatureConfiguration` class is used to configure the feature.

## Example

As an example, here's the random selector used to generate tree in the old growth taiga biome

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val TREES_OLD_GROWTH_SPRUCE_TAIGA = registerConfiguredFeature(
            "trees_old_growth_spruce_taiga",
            Feature.RANDOM_SELECTOR,
            RandomFeatureConfiguration(
                listOf(
                    WeightedPlacedFeature(
                        VanillaRegistryAccess.getHolder(TreePlacements.MEGA_SPRUCE_CHECKED), // (1)!
                        1f / 3f // (2)!
                    ),
                    WeightedPlacedFeature(
                        VanillaRegistryAccess.getHolder(TreePlacements.PINE_CHECKED),
                        1f / 3f // (3)!
                    )
                ),
                VanillaRegistryAccess.getHolder(TreePlacements.SPRUCE_CHECKED) // (4)!
            )
        )
    
    }
    ```

    1. Get the registry holder for the mega spruce tree placed feature. (Also support [inlined placed features](../placed-feature.md#inlined)
    2. The chance of the mega spruce tree is $^1/_{3}$.
    3. The chance of the pine tree is $^1/_{3}$.
    4. The default tree is a spruce tree (with a $^1/_{3}$ chance).

=== "Json"

    ```json title="configured_feature/trees_old_growth_spruce_taiga.json"
    {
      "type": "minecraft:random_selector",
      "config": {
        "features": [
          { // (1)!
            "chance": 0.33333334,
            "feature": "minecraft:mega_spruce_checked" // (2)!
          },
          { // (3)!
            "chance": 0.33333334,
            "feature": "minecraft:pine_checked"
          }
        ],
        "default": "minecraft:spruce_checked" // (4)!
      }
    }
    ```

    1. A mega spruce tree with a $^1/_{3}$ chance.
    2. As previously mentioned, this could also be an entire placed feature object. 
    3. A pine tree with a $^1/_{3}$ chance.
    4. A spruce tree with a $^1/_{3}$ chance.

![Example](https://i.imgur.com/JJZoK77.jpeg)