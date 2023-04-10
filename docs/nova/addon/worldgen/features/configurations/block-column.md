# Block column feature

The `block_column` feature allows you to add a column of blocks (e.g. sugar cane or cacti) to the world.

## Configuration

The following configuration options are available:

| Option              | Type                                                 | Description                                                                                                                                               |
|---------------------|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `layers`            | An array of `Layers`. See below for more information | Defines which block states should be used at specific heights.                                                                                            |
| `direction`         | `north`, `east`, `south`, `west`, `up` or `down`     | Determines the direction of the column.                                                                                                                   |
| `allowed_placement` | A [BlockPredicate](../../types/block-predicate.md)   | A predicate that has to match every block in the column **before** the block is placed.                                                                   |
| `prioritize_tip`    | A `boolean`                                          | When set to `true`, all underlying block will be removed if the current block doesn't match the provided [BlockPredicate](../../types/block-predicate.md) |

In code, the `BlockColumnConfiguration` class is used to configure the feature.

### Layer

Layers have 2 options: `height`, an [`IntProvider`](../../types/number-provider.md#intprovider) that determines the height of this 
layer, and `block`, a [`BlockStateProvider`](../../types/block-state-provider.md) that determines the block state to use for this
layer.

## Examples

As an example, here's the configured feature used to place cacti in the desert.  
<small>Please note that Minecraft uses the [`random_patch`](random-patch.md) feature to actually spread cacti and sugar cane.</small>

### Cactus

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val CACTUS = registerConfiguredFeature(
            "cactus",
            Feature.BLOCK_COLUMN,
            BlockColumnConfiguration(
                listOf(BlockColumnConfiguration.Layer(BiasedToBottomInt.of(1, 3), SimpleStateProvider.simple(Blocks.CACTUS))), // (1)!
                Direction.UP, // (2)!
                BlockPredicate.matchesBlocks(Blocks.AIR), // (3)!
                false // (4)!
            )
        )
    
    }
    ```

    1. The cactus only has a single layer of the `cactus` block which can be 1, 2 or 3 blocks high, biased towards a shorter height.
    2. The cactus grows upwards.
    3. Only place the cactus if the block above is air.
    4. Only the top of the cactus will be cut off if the block above is not air.

=== "Json"

    ```json title="configured_feature/cactus.json"
    {
      "type": "minecraft:block_column",
      "config": {
        "direction": "up", // (1)!
        "allowed_placement": {
          "type": "minecraft:matching_blocks",
          "blocks": "minecraft:air" // (2)!
        },
        "prioritize_tip": false, // (3)!
        "layers": [
          { // (4)!
            "height": { // (5)!
              "type": "minecraft:biased_to_bottom",
              "value": {
                "max_inclusive": 3,
                "min_inclusive": 1
              }
            },
            "provider": {
              "type": "minecraft:simple_state_provider",
              "state": {
                "Name": "minecraft:cactus",
                "Properties": {
                  "age": "0"
                }
              }
            }
          }
        ]
      }
    }
    ```

    1. The cactus grows upwards.
    2. Only place the cactus if the block above is air.
    3. Only the top of the cactus will be cut off if the block above is not air.
    4. Since the cactus only needs the normal cactus block, we only need one layer.
    5. The cactus can be 1, 2 or 3 blocks high, biased towards a shorter height.

#### Result

=== "Alone"

    <p class="text-center">
      <img src="https://i.imgur.com/MVKK0dp.png" width="30%" alt="Example"/>
    </p>

=== "Naturally generated"

    <p class="text-center">
      <img src="https://i.imgur.com/pyugGNl.png" width="50%" alt="Example"/>
    </p>


### Glow berry vines

Or, as another example, here's the configured and placed feature for glow berries/cave vines.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val CAVE_VINE: ConfiguredFeature<BlockColumnConfiguration, Feature<BlockColumnConfiguration>>
        
        init {
            val upperStateProvider = WeightedStateProvider( // (1)!
                SimpleWeightedRandomList.builder<BlockState>()
                    .add(Blocks.CAVE_VINES_PLANT.defaultBlockState(), 4)
                    .add(Blocks.CAVE_VINES_PLANT.defaultBlockState().setValue(CaveVines.BERRIES, true), 1)
            )
        
            val bottomStateProvider = RandomizedIntStateProvider(WeightedStateProvider( // (2)!
                SimpleWeightedRandomList.builder<BlockState>()
                    .add(Blocks.CAVE_VINES.defaultBlockState(), 4)
                    .add(Blocks.CAVE_VINES.defaultBlockState().setValue(CaveVines.BERRIES, true), 1)
            ), CaveVinesBlock.AGE, UniformInt.of(23, 25))
        
            val config = BlockColumnConfiguration(
                listOf( // (3)!
                    BlockColumnConfiguration.Layer(
                        WeightedListInt( // (4)!
                            SimpleWeightedRandomList.builder<IntProvider>()
                                .add(UniformInt.of(0, 19), 2)
                                .add(UniformInt.of(0, 2), 3)
                                .add(UniformInt.of(0, 6), 10)
                                .build()
                        ),
                        upperStateProvider // (5)!
                    ),
                    BlockColumnConfiguration.Layer(
                        ConstantInt.of(1), // (6)!
                        bottomStateProvider // (7)!
                    )
                ),
                Direction.DOWN, // (8)!
                BlockPredicate.ONLY_IN_AIR_PREDICATE, // (9)!
                true // (10)!
            )
        
            CAVE_VINE = registerConfiguredFeature("cave_vine", Feature.BLOCK_COLUMN, config)
        }
    
    }
    ```

    1. Each block of the upper layer of the vine can either be a normal or a vine with berries (biased towards normal).
    2. The bottom layer of the vine can either be a normal or a vine with berries (biased towards normal), and the age of the vine is randomized between 23 and 25.
    3. The vine has two layers, the upper layer (`upperStateProvider`) and the bottom layer (`bottomStateProvider `).
    4. The upper layer can be 0 to 19 blocks high, biased towards a medium height.
    5. The upper layer can be either a normal or a vine with berries (biased towards normal).
    6. The bottom layer is always 1 block high.
    7. The bottom layer can be either a normal or a vine with berries (biased towards normal), and the age of the vine is randomized between 23 and 25.
    8. The vine grows downwards.
    9. Only place the vine if the block below is air.
    10. If the predicate fails, the entire vine will be removed.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures: FeatureRegistry by ExampleAddon.registry {
    
        val CAVE_VINE = placedFeature("cave_vine", ConfiguredFeatures.CAVE_VINE)
            .count(188) // (1)!
            .inSquareSpread() // (2)!
            .heightRangeUniform(VerticalAnchor.BOTTOM, VerticalAnchor.absolute(256)) // (3)!
            .environmentScan( // (4)!
                Direction.UP,
                BlockPredicate.hasSturdyFace(Direction.DOWN),
                BlockPredicate.ONLY_IN_AIR_PREDICATE,
                12
            )
            .randomVerticalOffset(-1) // (5)!
            .biomeFilter() // (6)!
            .register()
    
    }
    ```

    1. 188 tries per chunk.
    2. Spread the locations in a square.
    3. Only place the vines in the y-range of bottom to 256.
    4. Search for the first block that has a solid face downwards (max 12 blocks away).
    5. Offset the location by $(0,-1,0)$.
    6. Only place the vines if the current biome has cave vines.

=== "Json"

    ```json title="configured_feature/cave_vine.json"
    {
      "type": "minecraft:block_column",
      "config": {
        "direction": "down", // (1)!
        "allowed_placement": {
          "type": "minecraft:matching_blocks",
          "blocks": "minecraft:air" // (2)!
        },
        "prioritize_tip": true, // (3)!
        "layers": [
          { // (4)!
            "height": {
              "type": "minecraft:weighted_list",
              "distribution": [
                {
                  "data": {
                    "type": "minecraft:uniform",
                    "value": {
                      "max_inclusive": 19,
                      "min_inclusive": 0
                    }
                  },
                  "weight": 2
                },
                {
                  "data": {
                    "type": "minecraft:uniform",
                    "value": {
                      "max_inclusive": 2,
                      "min_inclusive": 0
                    }
                  },
                  "weight": 3
                },
                {
                  "data": {
                    "type": "minecraft:uniform",
                    "value": {
                      "max_inclusive": 6,
                      "min_inclusive": 0
                    }
                  },
                  "weight": 10
                }
              ]
            },
            "provider": {
              "type": "minecraft:weighted_state_provider",
              "entries": [
                {
                  "data": {
                    "Name": "minecraft:cave_vines_plant",
                    "Properties": {
                      "berries": "false"
                    }
                  },
                  "weight": 4
                },
                {
                  "data": {
                    "Name": "minecraft:cave_vines_plant",
                    "Properties": {
                      "berries": "true"
                    }
                  },
                  "weight": 1
                }
              ]
            }
          },
          {
            "height": 1,
            "provider": {
              "type": "minecraft:randomized_int_state_provider",
              "property": "age",
              "source": {
                "type": "minecraft:weighted_state_provider",
                "entries": [
                  {
                    "data": {
                      "Name": "minecraft:cave_vines",
                      "Properties": {
                        "age": "0",
                        "berries": "false"
                      }
                    },
                    "weight": 4
                  },
                  {
                    "data": {
                      "Name": "minecraft:cave_vines",
                      "Properties": {
                        "age": "0",
                        "berries": "true"
                      }
                    },
                    "weight": 1
                  }
                ]
              },
              "values": {
                "type": "minecraft:uniform",
                "value": {
                  "max_inclusive": 25,
                  "min_inclusive": 23
                }
              }
            }
          }
        ]
      }
    }
    ```

    1. The vines grow downwards.
    2. Only place the vines if the block below is air.
    3. Remove all vines if the block below is not air.
    4. Place multiple cave vine plants (glow berries) at the top and always add a single cave vine at the bottom.

    ```json title="placed_feature/cave_vines.json"
    {
      "feature": "minecraft:cave_vine",
      "placement": [
        {
          "type": "minecraft:count",
          "count": 188 // (1)!
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
            "type": "minecraft:has_sturdy_face",
            "direction": "down"
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

    1. 188 tries per chunk.
    2. Spread the locations in a square.
    3. Only place the vines in the y-range of bottom to 256.
    4. Search for the first block that has a solid face downwards (max 12 blocks away).
    5. Offset the location by $(0,-1,0)$.
    6. Only place the vines if the current biome has cave vines.

#### Result

=== "Alone"

    <p class="text-center">
      <img src="https://i.imgur.com/7slobb1.png" width="30%" alt="Example"/>
    </p>

=== "Naturally generated"

    <p class="text-center">
      <img src="https://i.imgur.com/qFbdk7W.jpeg" alt="Example"/>
    </p>
