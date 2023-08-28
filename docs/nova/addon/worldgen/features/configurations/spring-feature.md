# Spring feature

The `spring_feature` allows you to single-block fluid springs in the world.

## Configuration

The `spring_feature` has the following configuration options:

| Option                                                        | Type                                                             | Description                                                        |
|---------------------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------------------------|
| `state`                                                       | A [`BlockState`](../../types/block-state.md) (Has to be a fluid) | The fluid state to use for the spring.                             |
| `requires_block_below` (optional in Json, defaults to `true`) | A `boolean`                                                      | Whether the spring requires a block in `valid_blocks` below.       |
| `rock_count` (optional in Json, defaults to 4)                | An `int`                                                         | The required amount of blocks in `valid_blocks` around the spring. |
| `hole_count` (optional in Json, defaults to 1)                | An `int`                                                         | The required amount of air blocks around the spring.               |
| `valid_blocks`                                                | A list of `BlockStates`                                          | The blocks that are valid for the spring to spawn in.              |

In code, the `SpringConfiguration` class is used to configure the feature.

## Example

As an example, here's the placed and configured feature used to place water springs in caves.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SPRING_WATER = registerConfiguredFeature(
            "spring_water",
            Feature.SPRING,
            SpringConfiguration(
                Fluids.WATER.defaultFluidState(), // state
                true, // requires_block_below
                4, // rock_count
                1, // hole_count
                HolderSet.direct( // valid_blocks
                    Block::builtInRegistryHolder,
                    Blocks.STONE, Blocks.GRANITE, Blocks.DIORITE, Blocks.ANDESITE, Blocks.DEEPSLATE, Blocks.TUFF, Blocks.CALCITE, Blocks.DIRT, Blocks.SNOW_BLOCK, Blocks.POWDER_SNOW, Blocks.PACKED_ICE
                )
            )
        )
    
    }
    ```
    
    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SPRING_WATER = placedFeature("spring_water", ConfiguredFeatures.SPRING_WATER)
            .count(25) // (1)!
            .inSquareSpread() // (2)!
            .heightRangeUniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(192)) // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```
    
    1. 25 attempts per chunk.
    2. Spread the springs out.
    3. Set the y-coordinate to a random value between the minimum y-level and 192.
    4. Only place the springs in biomes that have the configured feature.

=== "Json"

    ```json title="configured_feature/spring_water.json"
    {
      "type": "minecraft:spring_feature",
      "config": {
        "hole_count": 1,
        "requires_block_below": true,
        "rock_count": 4,
        "state": {
          "Name": "minecraft:water",
          "Properties": {
            "falling": "true"
          }
        },
        "valid_blocks": [
          "minecraft:stone",
          "minecraft:granite",
          "minecraft:diorite",
          "minecraft:andesite",
          "minecraft:deepslate",
          "minecraft:tuff",
          "minecraft:calcite",
          "minecraft:dirt",
          "minecraft:snow_block",
          "minecraft:powder_snow",
          "minecraft:packed_ice"
        ]
      }
    }
    ```
    
    ```json title="placed_feature/spring_water.json""
    {
      "feature": "minecraft:spring_water",
      "placement": [
        {
          "type": "minecraft:count", // (1)!
          "count": 25
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:height_range", // (3)!
          "height": {
            "type": "minecraft:uniform",
            "max_inclusive": {
              "absolute": 192
            },
            "min_inclusive": {
              "above_bottom": 0
            }
          }
        },
        {
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. 25 attempts per chunk.
    2. Spread the springs out.
    3. Set the y-coordinate to a random value between 0 and 192.
    4. Only place the springs in biomes that have the configured feature.

## Result

![Example](https://i.imgur.com/z29PhOL.png)