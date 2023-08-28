# Simple random selector feature

Similar to the [random selector](./random-selector.md) feature, the `simple_random_selector` feature can be used to
randomly choose from a provided list of features to place. The only difference being the absence of the `default` and
`probability` options since all features have an equal chance of being picked.

## Configuration

The `simple_random_selector` feature only has the `features` option:

| Option     | Type                                                                                 | Description                          |
|------------|--------------------------------------------------------------------------------------|--------------------------------------|
| `features` | Either a single placed feature object or a list of them (Ids are supported in Json). | The list of features to choose from. |

In code, the `SimpleRandomFeatureConfiguration` class is used to configure the feature.

## Example

As mentioned on the [Pointed Dripstone](pointed-dripstone.md) page, the `simple_random_selector` feature is used to
randomly choose between a stalactite and a stalagmite. Si here's the full configured- and placed feature.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val POINTED_DRIPSTONE = registerConfiguredFeature(
            "pointed_dripstone",
            Feature.SIMPLE_RANDOM_SELECTOR,
            SimpleRandomFeatureConfiguration(HolderSet.direct(
                PlacementUtils.inlinePlaced(
                    Feature.POINTED_DRIPSTONE,
                    PointedDripstoneConfiguration(0.2f, 0.7f, 0.5f, 0.5f),
                    EnvironmentScanPlacement.scanningFor(Direction.DOWN, BlockPredicate.solid(), BlockPredicate.ONLY_IN_AIR_OR_WATER_PREDICATE, 12),
                    RandomOffsetPlacement.vertical(ConstantInt.of(1))
                ),
                PlacementUtils.inlinePlaced(
                    Feature.POINTED_DRIPSTONE,
                    PointedDripstoneConfiguration(0.2f, 0.7f, 0.5f, 0.5f),
                    EnvironmentScanPlacement.scanningFor(Direction.UP, BlockPredicate.solid(), BlockPredicate.ONLY_IN_AIR_OR_WATER_PREDICATE, 12),
                    RandomOffsetPlacement.vertical(ConstantInt.of(-1)))
            ))
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val POINTED_DRIPSTONE = placedFeature("pointed_dripstone", ConfiguredFeatures.POINTED_DRIPSTONE)
            .count(UniformInt.of(192, 256))
            .inSquareSpread()
            .inYWorldBounds()
            .count(UniformInt.of(1, 5))
            .randomOffset(ClampedNormalInt.of(0.0f, 3.0f, -10, 10), ClampedNormalInt.of(0.0f, 0.6f, -2, 2))
            .biomeFilter()
            .register()
    
    }
    ```

=== "Json"

    ```json title="configured_feature/pointed_dripstone.json"
    {
      "type": "minecraft:simple_random_selector",
      "config": {
        "features": [
          {
            "feature": {
              "type": "minecraft:pointed_dripstone",
              "config": {
                "chance_of_directional_spread": 0.7,
                "chance_of_spread_radius2": 0.5,
                "chance_of_spread_radius3": 0.5,
                "chance_of_taller_dripstone": 0.2
              }
            },
            "placement": [
              {
                "type": "minecraft:environment_scan",
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
                "type": "minecraft:random_offset",
                "xz_spread": 0,
                "y_spread": 1
              }
            ]
          },
          {
            "feature": {
              "type": "minecraft:pointed_dripstone",
              "config": {
                "chance_of_directional_spread": 0.7,
                "chance_of_spread_radius2": 0.5,
                "chance_of_spread_radius3": 0.5,
                "chance_of_taller_dripstone": 0.2
              }
            },
            "placement": [
              {
                "type": "minecraft:environment_scan",
                "allowed_search_condition": {
                  "type": "minecraft:matching_blocks",
                  "blocks": [
                    "minecraft:air",
                    "minecraft:water"
                  ]
                },
                "direction_of_search": "up",
                "max_steps": 12,
                "target_condition": {
                  "type": "minecraft:solid"
                }
              },
              {
                "type": "minecraft:random_offset",
                "xz_spread": 0,
                "y_spread": -1
              }
            ]
          }
        ]
      }
    }
    ```

    ```json title="placed_feature/pointed_dripstone.json"
    {
      "feature": "minecraft:pointed_dripstone",
      "placement": [
        {
          "type": "minecraft:count",
          "count": {
            "type": "minecraft:uniform",
            "value": {
              "max_inclusive": 256,
              "min_inclusive": 192
            }
          }
        },
        {
          "type": "minecraft:in_square"
        },
        {
          "type": "minecraft:height_range",
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
          "type": "minecraft:count",
          "count": {
            "type": "minecraft:uniform",
            "value": {
              "max_inclusive": 5,
              "min_inclusive": 1
            }
          }
        },
        {
          "type": "minecraft:random_offset",
          "xz_spread": {
            "type": "minecraft:clamped_normal",
            "value": {
              "deviation": 3.0,
              "max_inclusive": 10,
              "mean": 0.0,
              "min_inclusive": -10
            }
          },
          "y_spread": {
            "type": "minecraft:clamped_normal",
            "value": {
              "deviation": 0.6,
              "max_inclusive": 2,
              "mean": 0.0,
              "min_inclusive": -2
            }
          }
        },
        {
          "type": "minecraft:biome"
        }
      ]
    }
    ```

![Example](https://i.imgur.com/G1ccC52.jpeg)