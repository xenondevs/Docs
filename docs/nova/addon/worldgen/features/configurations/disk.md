# Disk feature

The `disk` feature allows you to place disks of blocks in the world.

## Configuration

The `disk` feature has the following configuration options:

| Option           | Type                                                                                             | Description                                   |
|------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------|
| `state_provider` | See below.                                                                                       | The block state to use for the disk.          |
| `target`         | A [`BlockPredicate`](../../types/block-predicate.md).                                            | Must be passed in order to generate the disk. |
| `radius`         | An [`IntProvider`](../../types/number-provider.md#intprovider) (Range limit in Json is $[0;8]$). | Determines the radius of the disk.            |
| `half_height`    | An `int`. (Range limit in Json is $[0;8]$).                                                      | Defines half of the height of the disk.       |

In code, the `DiskConfiguration` class is used to configure the feature.

### State provider

The state provider has 2 main options. `fallback`, a [`BlockStateProvider`](../../types/block-state-provider.md) that is used
if none of the rules apply, and `rules`, a list of `Rule`s. Each rule has a [`BlockPredicate`](../../types/block-predicate.md)
via the `if_true` option, and a [`BlockStateProvider`](../../types/block-state-provider.md) via the `then` option. In code, the
class is called `RuleBasedBlockStateProvider`.

## Examples

As an example, here's the configured and placed feature for sand disks in lakes:

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val DISK_SAND = registerConfiguredFeature(
            "disk_sand",
            Feature.DISK,
            DiskConfiguration(
                RuleBasedBlockStateProvider(
                    BlockStateProvider.simple(Blocks.SAND), // (1)!
                    listOf(
                        RuleBasedBlockStateProvider.Rule(BlockPredicate.matchesBlocks(Direction.DOWN.normal, Blocks.AIR), BlockStateProvider.simple(Blocks.SANDSTONE)), // (2)!
                    )
                ),
                BlockPredicate.matchesBlocks(Blocks.DIRT, Blocks.GRASS_BLOCK), // (3)!
                UniformInt.of(2, 6), // (4)!
                2 // (5)!
            )
        )
    
    }
    ```

    1. This is the fallback block used if none of the rules listed below apply.
       Here, we use sand as the fallback if the block below is not air.
    2. If the block below is air, use sandstone since sand would fall down.
    3. Only allow `dirt` or `grass_block` in the center.
    4. Randomly chooses a radius between 2 and 6.
    5. The `half_height` of the disk.  
       The actual height will be $2 \times 2 + 1 = 5$ blocks.
    
    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures: FeatureRegistry by ExampleAddon.registry {
    
        val DISK_SAND = placedFeature("disk_sand", ConfiguredFeatures.DISK_SAND)
            .count(3) // (1)!
            .inSquareSpread() // (2)!
            .moveToTopSolid() // (3)!
            .blockPredicateFilter(BlockPredicate.matchesFluids(Fluids.WATER)) // (4)!
            .biomeFilter() // (5)!
            .register()
    
    }
    ```

    1. 3 tries per chunk.
    2. Spread the disks in a square.
    3. Makes sure to move the y coordinate to one block above the first solid block. This call is equivalent to 
       ```kotlin
       HeightmapPlacement.onHeightmap(Heightmap.Types.OCEAN_FLOOR_WG)
       ```
    4. Only place the disk if the block is water.
    5. Only place the disk if the current biome has sand disks.

=== "Json"

    ```json title="configured_feature/disk_sand.json"
    {
      "type": "minecraft:disk",
      "config": {
        "half_height": 2,
        "radius": { // (1)!
          "type": "minecraft:uniform",
          "value": {
            "max_inclusive": 6,
            "min_inclusive": 2
          }
        },
        "state_provider": {
          "fallback": { // (2)!
            "type": "minecraft:simple_state_provider",
            "state": {
              "Name": "minecraft:sand"
            }
          },
          "rules": [  // (3)!
            {
              "if_true": {
                "type": "minecraft:matching_blocks",
                "blocks": "minecraft:air",
                "offset": [
                  0,
                  -1,
                  0
                ]
              },
              "then": {
                "type": "minecraft:simple_state_provider",
                "state": {
                  "Name": "minecraft:sandstone"
                }
              }
            }
          ]
        },
        "target": { // (4)!
          "type": "minecraft:matching_blocks",
          "blocks": [
            "minecraft:dirt",
            "minecraft:grass_block"
          ]
        }
      }
    }
    ```
    
    1. Randomly chooses a radius between 2 and 6.
    2. If the block isn't air, use sand.
    3. Otherwise, if the block below is air, use sandstone.
    4. Only allow `dirt` or `grass_block` in the center.
    
    ```json title="placed_feature/disk_sand.json"
    {
      "feature": "minecraft:disk_sand",
      "placement": [
        {
          "type": "minecraft:count",
          "count": 3 // (1)!
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:heightmap", // (3)!
          "heightmap": "OCEAN_FLOOR_WG"
        },
        {
          "type": "minecraft:block_predicate_filter", // (4)!
          "predicate": {
            "type": "minecraft:matching_fluids",
            "fluids": "minecraft:water"
          }
        },
        {
          "type": "minecraft:biome" // (5)!
        }
      ]
    }
    ```
    
    1. 3 tries per chunk.
    2. Spread the disks in a square.
    3. Makes sure to move the y coordinate to one block above the first solid block.
    4. Only place the disk if the block is water.
    5. Only place the disk if the current biome has sand disks.

## Result

![Example](https://i.imgur.com/G2Ebb1v.gif)