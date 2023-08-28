# End gateway feature

The `end_gateway` feature can be used to place end gateways in the world.

## Configuration

An end gateway feature has the following configuration options:

| Option            | Type                                                                                                                            | Description                                                       |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `exit` (optional) | A `BlockPos` (In Json, the `BlockPos` is represented via an array of coordinates. First element is the x coordinate and so on.) | The exit location of the end gateway.                             |
| `exact`           | `boolean`                                                                                                                       | Whether entities should be teleported to the exact exit location. |

In code, the `EndGatewayConfiguration` class is used to configure the feature.

## Example

Here's the configured and placed feature for the vanilla return end gateway:

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val END_GATEWAY_RETURN = registerConfiguredFeature(
            "end_gateway_return",
            Feature.END_GATEWAY,
            EndGatewayConfiguration.knownExit( // (1)!
                ServerLevel.END_SPAWN_POINT, // (2)!
                true // (3)!
            )
        )
    
    }
    ```

    1. If the exit location is still unknown during registration (for example for random teleportation), use
       ```kotlin
       EndGatewayConfiguration.delayedExitSearch()
       ```
    2. Constant for the end spawn point at $(100|50|0)$.
    3. Entities should be teleported to the exact exit location.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val END_GATEWAY_RETURN = placedFeature("end_gateway_return", ConfiguredFeatures.END_GATEWAY_RETURN)
            .rarityFilter(700) // (1)!
            .inSquareSpread() // (2)!
            .moveToMotionBlocking() // (3)!
            .randomVerticalOffset(UniformInt.of(3, 9)) // (4)!
            .biomeFilter() // (5)!
            .register()
    
    }
    ```

    1. Give the end gateway a chance of $^1/_{700}$ to spawn. Or in other words, the end gateway will spawn in 1 out of 700 chunks.
    2. Randomly offset the gateways in a square.
    3. Move the gateways to the surface. The call is equivalent to
       ```kotlin
       HeightmapPlacement.onHeightmap(Heightmap.Types.MOTION_BLOCKING)
       ```
    4. Randomly offset the gateways in the y direction.
    5. Only place the gateways in biomes that have end gateways

=== "Json"

    ```json title="configured_feature/end_gateway_return.json"
    {
      "type": "minecraft:end_gateway",
      "config": {
        "exact": true,
        "exit": [ // (1)!
          100,
          50,
          0
        ]
      }
    }
    ```

    1. The end spawn point is always at $(100|50|0)$

    ```json title="placed_feature/end_gateway_return.json"
    {
      "feature": "minecraft:end_gateway_return",
      "placement": [
        {
          "type": "minecraft:rarity_filter", // (1)!
          "chance": 700
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:heightmap", // (3)!
          "heightmap": "MOTION_BLOCKING"
        },
        {
          "type": "minecraft:random_offset", // (4)!
          "xz_spread": 0,
          "y_spread": {
            "type": "minecraft:uniform",
            "value": {
              "max_inclusive": 9,
              "min_inclusive": 3
            }
          }
        },
        {
          "type": "minecraft:biome" // (5)!
        }
      ]
    }
    ```

    1. Give the end gateway a chance of $^1/_{700}$ to spawn. Or in other words, the end gateway will spawn in 1 out of 700 chunks.
    2. Randomly offset the gateways in a square.
    3. Move the gateways to the surface.
    4. Randomly offset the gateways in the y direction.
    5. Only place the gateways in biomes that have end gateways.

## Result

<p class="text-center">
  <img src="https://i.imgur.com/N5NZfbC.png" width="50%" alt="Example"/>
</p>