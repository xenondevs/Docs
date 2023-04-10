# Geode feature

!!! warning

     Advanced Knowledge Required - This documentation page is intended for users with in-depth knowledge of the world 
     generation system. Beginner users may find the content challenging to understand.

The `geode` feature can be used to generate geode-like structures in the world.

## Configuration

The `geode` feature allows a very wide range of configuration options. The more nested configuration options are explained below the main table.

| Option                                                                                 | Type                                                                                              | Description                                                                                                               | Amethyst geode value             |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| `blocks`                                                                               | See [below](#blocks).                                                                             | Specifies which blocks to use for the geode.                                                                              | /                                |
| `layers`                                                                               | See [below](#layers).                                                                             | Specifies the radius of each layer.                                                                                       | /                                |
| `crack`                                                                                | See [below](#crack).                                                                              | Specifies options about the crack in the geode.                                                                           | /                                |
| `use_potential_placements_chance` (optional in Json, defaults to `0.35`)               | A `double` in the range $[0.0;1.0]$.                                                              | The chance each inner block to get a inner placement.                                                                     | `0.35`                           |
| `use_alternate_layer0_chance`  (optional in Json, defaults to `0.0`)                   | A `double` in the range $[0.0;1.0]$.                                                              | The chance for a inner layer block to use the specified alternative block.                                                | `0.083`                          |
| `placements_require_layer0_alternate` (optional in Json, defaults to `true`)           | A `boolean`                                                                                       | If `true`, the inner placement will only be placed on the specified alternative block.                                    | `true`                           |
| `outer_wall_distance` (optional in Json, defaults to a random int. Either `4` or `5`)  | An [`IntProvider`](../../types/number-provider.md#intprovider). (Range limit in Json is $[1;20]$) | The offset of each coordinate from the feature origin.                                                                    | Random `int` between `4` and `6` |
| `distribution_points` (optional in Json, defaults to a random int. Either `3` or `4` ) | An `IntProvider`. (Range limit in Json is $[1;20]$)                                               | How often to check for invalid blocks near the center of the geode.                                                       | Random `int`. Either `3` or `4`  |
| `point_offset` (optional in Json, defaults to a random int. Either `1` or `2`)         | An `IntProvider`. (Range limit in Json is $[1;10]$)                                               | The offset of each point.                                                                                                 | Random `int`. Either `1` or `2`  |
| `min_gen_offset` (optional in Json, defaults to `-16`)                                 | An `int`                                                                                          | The minimum [Chebyshev distance](https://en.wikipedia.org/wiki/Chebyshev_distance) of each block from the feature origin. | `-16`                            |
| `max_gen_offset` (optional in Json, defaults to `16`)                                  | An `int`                                                                                          | The maximum Chebyshev distance of each block from the feature origin.                                                     | `16`                             |
| `noise_multiplier` (optional in Json, defaults to `0.05`)                              | A `double` in the range $[0.0;1.0]$.                                                              | The multiplier for the noise value.                                                                                       | `0.05`                           |               
| `invalid_blocks_threshold`                                                             | An `int`                                                                                          | The max. amount of invalid blocks. If the threshold is exceeded, the feature won't be generated                           | `1`                              |

In code, the `GeodeConfiguration` class is used to configure the feature.

### `blocks`

The blocks configuration of the geode. It has the following options:

| Option                           | Type                                                        | Description                                                                                                                                              | Amethyst geode value                                                 |
|----------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| `filling_provider`               | [`BlockStateProvider`](../../types/block-state-provider.md) | The block to use for the filling of the geode. Should be air in most cases.                                                                              | `minecraft:air`                                                      |
| `inner_layer_provider`           | `BlockStateProvider`                                        | The block to use for the inner layer of the geode.                                                                                                       | `minecraft:amethyst_block`                                           |
| `alternate_inner_layer_provider` | `BlockStateProvider`                                        | The block that is randomly spread inside the inner layer.                                                                                                | `minecraft:budding_amethyst`                                         |
| `middle_layer_provider`          | `BlockStateProvider`                                        | The block to use for the middle layer of the geode.                                                                                                      | `minecraft:calcite`                                                  |
| `outer_layer_provider`           | `BlockStateProvider`                                        | The block to use for the outer layer of the geode.                                                                                                       | `minecraft:smooth_basalt`                                            |
| `inner_placements`               | A list of `BlockStateProvider`s.                            | A list of blocks to randomly place inside the geode. **(cannot be empty!)**                                                                              | `minecraft:small_amethyst_bud`, `minecraft:medium_amethyst_bud`, ... |
| `cannot_replace`                 | A block tag (Starting with `#` in Json).                    | Defines which block shouldn't be replaced when placing the geode.                                                                                        | `#minecraft:features_cannot_replace`                                 |
| `invalid_blocks`                 | A block tag (Starting with `#` in Json).                    | If the amount of blocks matching this tag exceeds the above defined threshold the geode won't be placed. Currently not usable because of a Minecraft bug | `#minecraft:geode_invalid_blocks`                                    |

In code, the `GeodeBlockSettings` class is used to configure the blocks of the geode.

### `layers`

Defines the max radius of each layer of the geode. The higher the value the higher the max radius of the respective layer.
The following options are all `double`s in the range $[0.01;50.0]$.

| Option                                               | Description                                                                 | Amethyst geode value |
|------------------------------------------------------|-----------------------------------------------------------------------------|----------------------|
| `filling` (optional in Json, defaults to `1.7`)      | The max radius of the filling layer. (Range limit in Json is $[0.01;50.0]$) | `1.7`                |
| `inner_layer` (optional in Json, defaults to `2.2`)  | The max radius of the inner layer. (Range limit in Json is $[0.01;50.0]$)   | `2.2`                |
| `middle_layer` (optional in Json, defaults to `3.2`) | The max radius of the middle layer. (Range limit in Json is $[0.01;50.0]$)  | `3.2`                |
| `outer_layer` (optional in Json, defaults to `4.2`)  | The max radius of the outer layer. (Range limit in Json is $[0.01;50.0]$)   | `4.2`                |

In code, the `GeodeLayerSettings` class is used to configure the layers of the geode.

### `crack`

The crack configuration of the geode. It has the following options:

| Option                                                        | Type                                             | Description                                | Amethyst geode value |
|---------------------------------------------------------------|--------------------------------------------------|--------------------------------------------|----------------------|
| `generate_crack_chance` (optional in Json, defaults to `1.0`) | A `double` in the range $[0.0;1.0]$.             | The chance that a crack will be generated. | `0.95`               |
| `base_crack_size` (optional in Json, defaults to `2.0`)       | A `double`. (Range limit in Json is $[0.0;5.0]$) | The base size of a crack.                  | `2.0`                |
| `crack_point_offset` (optional in Json, defaults to `2`)      | An `int`. (Range limit in Json is $[0;10]$)      | The offset of the crack point.             | `2`                  |

In code, the `GeodeCrackSettings` class is used to configure the crack of the geode.

## Example

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val AMETHYST_GEODE = registerConfiguredFeature(
            "amethyst_geode",
            Feature.GEODE,
            GeodeConfiguration(
                GeodeBlockSettings(
                    BlockStateProvider.simple(Blocks.AIR), // fillingProvider
                    BlockStateProvider.simple(Blocks.AMETHYST_BLOCK), // innerLayerProvider
                    BlockStateProvider.simple(Blocks.BUDDING_AMETHYST), // alternateInnerLayerProvider
                    BlockStateProvider.simple(Blocks.CALCITE), // middleLayerProvider
                    BlockStateProvider.simple(Blocks.SMOOTH_BASALT), // outerLayerProvider
                    listOf( // innerPlacements
                        Blocks.SMALL_AMETHYST_BUD.defaultBlockState(),
                        Blocks.MEDIUM_AMETHYST_BUD.defaultBlockState(),
                        Blocks.LARGE_AMETHYST_BUD.defaultBlockState(),
                        Blocks.AMETHYST_CLUSTER.defaultBlockState()
                    ),
                    BlockTags.FEATURES_CANNOT_REPLACE, // cannotReplace
                    BlockTags.GEODE_INVALID_BLOCKS // invalidBlocks
                ),
                GeodeLayerSettings(
                    1.7, // filling
                    2.2, // innerLayer
                    3.2, // middleLayer
                    4.2 // outerLayer
                ),
                GeodeCrackSettings(
                    0.95, // generateCrackChance
                    2.0, // baseCrackSize
                    2 // crackPointOffset
                ),
                .35, // usePotentialPlacementsChance
                .083, // useAlternateLayer0Chance
                true, // placementsRequireLayer0Alternate
                UniformInt.of(4, 6), // outerWallDistance
                UniformInt.of(3, 4), // distributionPoints
                UniformInt.of(1, 2), // pointOffset
                -16, // minGenOffset
                16, // maxGenOffset
                0.05, // noiseMultiplier
                1 // invalidBlocksThreshold
            )
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val AMETHYST_GEODE = placedFeature("amethyst_geode", ConfiguredFeatures.AMETHYST_GEODE)
            .rarityFilter(24)
            .inSquareSpread()
            .heightRangeUniform(VerticalAnchor.aboveBottom(6), VerticalAnchor.absolute(30))
            .biomeFilter()
            .register()
    
    }
    ```

=== "Json"

    ```json title="configured_feature/amethyst_geode.json"
    {
      "type": "minecraft:geode",
      "config": {
        "blocks": {
          "alternate_inner_layer_provider": {
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:budding_amethyst"
            }
          },
          "cannot_replace": "#minecraft:features_cannot_replace",
          "filling_provider": {
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:air"
            }
          },
          "inner_layer_provider": {
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:amethyst_block"
            }
          },
          "inner_placements": [
            {
              "Name": "minecraft:small_amethyst_bud",
              "Properties": {
                "facing": "up",
                "waterlogged": "false"
              }
            },
            {
              "Name": "minecraft:medium_amethyst_bud",
              "Properties": {
                "facing": "up",
                "waterlogged": "false"
              }
            },
            {
              "Name": "minecraft:large_amethyst_bud",
              "Properties": {
                "facing": "up",
                "waterlogged": "false"
              }
            },
            {
              "Name": "minecraft:amethyst_cluster",
              "Properties": {
                "facing": "up",
                "waterlogged": "false"
              }
            }
          ],
          "invalid_blocks": "#minecraft:geode_invalid_blocks",
          "middle_layer_provider": {
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:calcite"
            }
          },
          "outer_layer_provider": {
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:smooth_basalt"
            }
          }
        },
        "crack": {
          "base_crack_size": 2.0,
          "crack_point_offset": 2,
          "generate_crack_chance": 0.95
        },
        "distribution_points": {
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 4,
            "min_inclusive": 3
          }
        },
        "invalid_blocks_threshold": 1,
        "layers": {
          "filling": 1.7,
          "inner_layer": 2.2,
          "middle_layer": 3.2,
          "outer_layer": 4.2
        },
        "max_gen_offset": 16,
        "min_gen_offset": -16,
        "noise_multiplier": 0.05,
        "outer_wall_distance": {
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 6,
            "min_inclusive": 4
          }
        },
        "placements_require_layer0_alternate": true,
        "point_offset": {
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 2,
            "min_inclusive": 1
          }
        },
        "use_alternate_layer0_chance": 0.083,
        "use_potential_placements_chance": 0.35
      }
    }
    ```
    
    ```json title="placed_feature/amethyst_geode.json"
    {
      "feature": "minecraft:amethyst_geode",
      "placement": [
        {
          "type": "minecraft:rarity_filter",
          "chance": 24
        },
        {
          "type": "minecraft:in_square"
        },
        {
          "type": "minecraft:height_range",
          "height": {
            "type": "minecraft:uniform",
            "max_inclusive": {
              "absolute": 30
            },
            "min_inclusive": {
              "above_bottom": 6
            }
          }
        },
        {
          "type": "minecraft:biome"
        }
      ]
    }
    ```

## Result

<p class="text-center">
  <img src="https://i.imgur.com/RYgAs6a.png" width="50%" alt="Example"/>
</p>