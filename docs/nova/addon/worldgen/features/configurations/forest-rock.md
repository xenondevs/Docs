# Forest rock feature

The `forest_rock` feature can be used to generate small $3x3$ rocks in the world.

## Configuration

Only the block state used for the rocks is configurable:

| Option  | Type                                          | Description                          |
|---------|-----------------------------------------------|--------------------------------------|
| `state` | A  [`BlockState`](../../types/block-state.md) | The block state to use for the rock. |

In code, the `BlockStateConfiguration` class is used to configure the feature.

## Example

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val FOREST_ROCK = registerConfiguredFeature(
            "forest_rock",
            Feature.FOREST_ROCK,
            BlockStateConfiguration(Blocks.MOSSY_COBBLESTONE.defaultBlockState())
        )
    
    }
    ```

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val FOREST_ROCK = placedFeature("forest_rock", ConfiguredFeatures.FOREST_ROCK)
            .count(2) // (1)!
            .inSquareSpread() // (2)!
            .moveToMotionBlocking() // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```

    1. Generate 2 rocks per chunk.
    2. Randomly offset the x- and z-coordinates of the rock.
    3. Set the y-coordinate of the rock to the highest motion-blocking block. The call is equivalent to
       ```kotlin
       HeightmapPlacement.onHeightmap(Heightmap.Types.MOTION_BLOCKING)
       ```
    4. Only generate the feature if the center pos hasn't moved to another biome that doesn't have the `forest_rock` feature.

=== "Json"

    ```json title="configured_feature/forest_rock.json"
    {
      "type": "minecraft:forest_rock",
      "config": {
        "state": {
          "Name": "minecraft:mossy_cobblestone"
        }
      }
    }
    ```
    
    ```json title="placed_feature/forest_rock.json"
    {
      "feature": "minecraft:forest_rock",
      "placement": [
        {
          "type": "minecraft:count",
          "count": 2 // (1)!
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:heightmap",
          "heightmap": "MOTION_BLOCKING" // (3)!
        },
        {
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. Generate 2 rocks per chunk.
    2. Randomly offset the x- and z-coordinates of the rock.
    3. Set the y-coordinate of the rock to the highest motion-blocking block.
    4. Only generate the feature if center pos hasn't moved to another biome that doesn't have the `forest_rock` feature.

## Result

=== "Alone"

    <p class="text-center">
      <img src="https://i.imgur.com/DT8h7o3.gif" width="50%" alt="Example"/>
    </p>

=== "Naturally generated"

    <p class="text-center">
      <img src="https://i.imgur.com/o8nrBsv.gif" width="50%" alt="Example"/>
    </p>