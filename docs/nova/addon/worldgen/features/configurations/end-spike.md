# End spike feature

The `end_spike` feature can be used to place end spikes (also known as obsidian pillars) in the world.

## Configuration

The following configuration options are available:

| Option                                                         | Type                                                                                                                            | Description                                                                   |
|----------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `crystal_invulnerable` (optional in Json, defaults to `false`) | `boolean`                                                                                                                       | Whether the crystals on top of the end spikes should be invulnerable.         |
| `spikes`                                                       | A `List` of `EndSpikes`. See below for more information                                                                         | The spikes to place. If the array is empty, the default end spikes are placed |
| `crystal_beam_target` (optional)                               | A `BlockPos` (In Json, the `BlockPos` is represented via an array of coordinates. First element is the x coordinate and so on.) | The target of the crystal beam.                                               |

In code, the `SpikeConfiguration` class is used to configure the feature.

### EndSpikes

The `EndSpikes` can be configured with the following options:

| Option                                            | Type      | Description                                               |
|---------------------------------------------------|-----------|-----------------------------------------------------------|
| `centerX` (optional in Json, defaults to `0`)     | `int`     | The x coordinate of the center of the spike.              |
| `centerZ` (optional in Json, defaults to `0`)     | `int`     | The z coordinate of the center of the spike.              |
| `radius` (optional in Json, defaults to `0`)      | `int`     | The radius of the spike.                                  |
| `height` (optional in Json, defaults to `0`)      | `int`     | The height of the spike.                                  |
| `guarded` (optional in Json, defaults to `false`) | `boolean` | Whether iron bars should be placed around the end crystal |

The `SpikeFeature.EndSpike` class is used to configure the spikes in code.

## Examples

As an example, here's the configured feature used to place the default end spikes on the main island:

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val END_SPIKE = registerConfiguredFeature(
            "end_spike",
            Feature.END_SPIKE,
            SpikeConfiguration(false, emptyList(), null) // (1)!
        )
    
    }
    ```

    1. Since Minecraft only needs the default end spikes, we don't need to configure anything. `false` means that the 
       crystals on top of the end spikes should not be invulnerable and `null` is the crystal beam target.

=== "Json"

    ```json title="configured_feature/end_spike.json"
    {
      "type": "minecraft:end_spike",
      "config": {
        "crystal_invulnerable": false,
        "spikes": [] // (1)!
      }
    }
    ```

    1. Since Minecraft only needs the default end spikes, we don't need to configure anything.

??? Example "Example with a filled array"

    === "Kotlin"

        ```kotlin title="ConfiguredFeatures.kt"
        val END_SPIKE = registerConfiguredFeature(
            "end_spike",
            Feature.END_SPIKE,
            SpikeConfiguration(
                false, // (1)!
                listOf(
                    EndSpike(42, 0, 2, 82, true), // (2)!
                    EndSpike(33, 24, 4, 94, false),
                    EndSpike(12, 39, 5, 103, false),
                    EndSpike(-13, 39, 2, 79, true),
                    EndSpike(-34, 24, 4, 97, false),
                    EndSpike(-42, -1, 3, 88, false),
                    EndSpike(-34, -25, 3, 91, false),
                    EndSpike(-13, -40, 3, 85, false),
                    EndSpike(12, -40, 4, 100, false),
                    EndSpike(33, -25, 2, 76, false)
                ),
                null // (3)!
            )
        )
        ```

        1. Don't make the crystals invulnerable.
        2. The first spike is at the coordinates `42, 0` with a radius of `2` and a height of `82`. `true` specifies that 
           iron bars should be placed around the end crystal.
        3. Don't specify any specific target for the crystal beam.

    === "Json"

        ```json title="configured_feature/end_spike.json"
        {
          "type": "minecraft:end_spike",
          "config": {
            "crystal_invulnerable": false,
            "spikes": [
              {
                "centerX": 42,
                "centerZ": 0,
                "radius": 2,
                "height": 82,
                "guarded": true
              },
              {
                "centerX": 33,
                "centerZ": 24,
                "radius": 4,
                "height": 94,
                "guarded": false
              },
              {
                "centerX": 12,
                "centerZ": 39,
                "radius": 5,
                "height": 103,
                "guarded": false
              },
              {
                "centerX": -13,
                "centerZ": 39,
                "radius": 2,
                "height": 79,
                "guarded": true
              },
              {
                "centerX": -34,
                "centerZ": 24,
                "radius": 4,
                "height": 97,
                "guarded": false
              },
              {
                "centerX": -42,
                "centerZ": -1,
                "radius": 3,
                "height": 88,
                "guarded": false
              },
              {
                "centerX": -34,
                "centerZ": -25,
                "radius": 3,
                "height": 91,
                "guarded": false
              },
              {
                "centerX": -13,
                "centerZ": -40,
                "radius": 3,
                "height": 85,
                "guarded": false
              },
              {
                "centerX": 12,
                "centerZ": -40,
                "radius": 4,
                "height": 100,
                "guarded": false
              },
              {
                "centerX": 33,
                "centerZ": -25,
                "radius": 2,
                "height": 76,
                "guarded": false
              }
            ]
          }
        }
        ```

=== "Kotlin"

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val END_SPIKE = placedFeature("end_spike", ConfiguredFeatures.END_SPIKE)
            .biomeFilter() // (1)!
            .register()
    
    }
    ```

    1. Most of the placement logic is handled by the feature itself. The only thing we need to do is to specify that the 
       feature should only be placed in biomes that have end spikes.

=== "Json"    

    ```json title="placed_feature/end_spike.json"
    {
      "feature": "minecraft:end_spike",
      "placement": [
        {
          "type": "minecraft:biome" // (1)!
        }
      ]
    }
    ```

    1. Most of the placement logic is handled by the feature itself. The only thing we need to do is to specify that the 
       feature should only be placed in biomes that have end spikes.

## Result

![Example](https://i.imgur.com/75EsKn7.gif)