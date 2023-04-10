# Root system feature

!!! warning

     Advanced Knowledge Required - This documentation page is intended for users with in-depth knowledge of the world 
     generation system. Beginner users may find the content challenging to understand.

The `root_system` feature can be used to generate trees with roots.

## Configuration

A root system feature has the following configuration options:

| Option                             | Type                                                          | Description                                                 |
|------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------|
| `feature`                          | A [`PlacedFeature`](../placed-feature.md) (or id in Json)     | The feature to place at the tree position.                  |
| `required_vertical_space_for_tree` | An `int`. (Range limit in Json is $[1;64]$)                   | The amount of vertical space required for the tree to grow. |
| `root_radius`                      | An `int`. (Range limit in Json is $[1;64]$)                   | The radius of the root system.                              |
| `root_replaceable`                 | A block tag (prefixed with `#` in Json)                       | The blocks that can be replaced by roots.                   |
| `root_state_provider`              | A [`BlockStateProvider`](../../types/block-state-provider.md) | The block state to use for the root.                        |
| `root_placement_attempts`          | An `int`. (Range limit in Json is $[1;256]$)                  | The amount of attempts to place a root.                     |
| `root_column_max_height`           | An `int`. (Range limit in Json is $[1;4096]$)                 | The maximum height of a root column.                        |
| `hanging_root_radius`              | An `int`. (Range limit in Json is $[1;64]$)                   | The radius of hanging roots.                                |
| `hanging_roots_vertical_span`      | An `int`. (Range limit in Json is $[0;16]$)                   | The vertical span of hanging roots.                         |
| `hanging_root_state_provider`      | A `BlockStateProvider`                                        | The block state to use for the hanging root.                |
| `hanging_root_placement_attempts`  | An `int`. (Range limit in Json is $[1;256]$)                  | The amount of attempts to place a hanging root.             |
| `allowed_vertical_water_for_tree`  | An `int`. (Range limit in Json is $[0;64]$)                   | The amount of vertical water allowed for the tree to grow.  |
| `allowed_tree_position`            | A [`BlockPredicate`](../../types/block-predicate.md)          | A predicate to check if the tree position is valid.         |

In code, the `RootSystemConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature for the azalea tree

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val ROOTED_AZALEA_TREE = registerConfiguredFeature(
            "rooted_azalea_tree",
            Feature.ROOT_SYSTEM,
            RootSystemConfiguration(
                PlacementUtils.inlinePlaced(VanillaRegistryAccess.getHolder(TreeFeatures.AZALEA_TREE)), // feature
                3, // required_vertical_space_for_tree
                3, // root_radius
                BlockTags.AZALEA_ROOT_REPLACEABLE, // root_replaceable
                BlockStateProvider.simple(Blocks.ROOTED_DIRT), // root_state_provider
                20, // root_placement_attempts
                100, // root_column_max_height
                3, // hanging_root_radius
                2, // hanging_roots_vertical_span
                BlockStateProvider.simple(Blocks.HANGING_ROOTS), // hanging_root_state_provider
                20, // hanging_root_placement_attempts
                2, // allowed_vertical_water_for_tree
                BlockPredicate.allOf( // allowed_tree_position
                    BlockPredicate.anyOf(
                        BlockPredicate.matchesBlocks(Blocks.AIR, Blocks.CAVE_AIR, Blocks.VOID_AIR, Blocks.WATER),
                        BlockPredicate.matchesTag(BlockTags.LEAVES),
                        BlockPredicate.matchesTag(BlockTags.REPLACEABLE_PLANTS)
                    ),
                    BlockPredicate.matchesTag(Direction.DOWN.normal, BlockTags.AZALEA_GROWS_ON)
                )
            )
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val ROOTED_AZALEA_TREE = placedFeature("rooted_azalea_tree", ConfiguredFeatures.ROOTED_AZALEA_TREE)
            .count(UniformInt.of(1, 2))
            .inSquareSpread()
            .inYWorldBounds() // (1)!
            .environmentScan(Direction.UP, BlockPredicate.solid(), BlockPredicate.ONLY_IN_AIR_PREDICATE, 12)
            .randomVerticalOffset(-1)
            .biomeFilter()
            .register()
    
    }
    ```

    1. Set the y-level to a random int up to 256. The call is equivalent to
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(256));
       ```
    2. Search for the first solid block upwards.

=== "Json"

    ```json title="configured_feature/rooted_azalea_tree.json"
    {
      "type": "minecraft:root_system",
      "config": {
        "allowed_tree_position": {
          "type": "minecraft:all_of",
          "predicates": [
            {
              "type": "minecraft:any_of",
              "predicates": [
                {
                  "type": "minecraft:matching_blocks",
                  "blocks": [
                    "minecraft:air",
                    "minecraft:cave_air",
                    "minecraft:void_air",
                    "minecraft:water"
                  ]
                },
                {
                  "type": "minecraft:matching_block_tag",
                  "tag": "minecraft:leaves"
                },
                {
                  "type": "minecraft:matching_block_tag",
                  "tag": "minecraft:replaceable_plants"
                }
              ]
            },
            {
              "type": "minecraft:matching_block_tag",
              "offset": [
                0,
                -1,
                0
              ],
              "tag": "minecraft:azalea_grows_on"
            }
          ]
        },
        "allowed_vertical_water_for_tree": 2,
        "feature": {
          "feature": "minecraft:azalea_tree",
          "placement": []
        },
        "hanging_root_placement_attempts": 20,
        "hanging_root_radius": 3,
        "hanging_root_state_provider": {
          "type": "minecraft:simple_state_provider",
          "state": {
            "Name": "minecraft:hanging_roots",
            "Properties": {
              "waterlogged": "false"
            }
          }
        },
        "hanging_roots_vertical_span": 2,
        "required_vertical_space_for_tree": 3,
        "root_column_max_height": 100,
        "root_placement_attempts": 20,
        "root_radius": 3,
        "root_replaceable": "#minecraft:azalea_root_replaceable",
        "root_state_provider": {
          "type": "minecraft:simple_state_provider",
          "state": {
            "Name": "minecraft:rooted_dirt"
          }
        }
      }
    }
    ```
    
    ```json title="placed_feature/rooted_azalea_tree.json"
    {
      "feature": "minecraft:rooted_azalea_tree",
      "placement": [
        {
          "type": "minecraft:count",
          "count": {
            "type": "minecraft:uniform",
            "value": {
              "max_inclusive": 2,
              "min_inclusive": 1
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
          "type": "minecraft:environment_scan",
          "allowed_search_condition": {
            "type": "minecraft:matching_blocks",
            "blocks": "minecraft:air"
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
        },
        {
          "type": "minecraft:biome"
        }
      ]
    }
    ```

## Result

![Example](https://i.imgur.com/KcPb1G5.gif)