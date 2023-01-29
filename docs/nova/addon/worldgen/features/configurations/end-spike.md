# End spike feature

The `end_spike` feature can be used to place end spikes (also known as obsidian pillars) in the world.

## Configuration

The following configuration options are available:


| Option                                                 | Type                                                                  | Description                                                                   |
|--------------------------------------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `crystal_invulnerable` (optional, defaults to `false`) | `boolean`                                                             | Whether the crystals on top of the end spikes should be invulnerable.         |
| `crystal_beam_target` (optional)                       | An array of coordinates. First element is the x coordinate and so on. | The target of the crystal beam.                                               |
| `spikes`                                               | An array of `Spikes`s. See below for more information                 | The spikes to place. If the array is empty, the default end spikes are placed |

In code, the `SpikeConfiguration` class is used to configure the feature.

### Spike

The spikes can be configured with the following options:

| Option                                    | Type      | Description                                               |
|-------------------------------------------|-----------|-----------------------------------------------------------|
| `centerX` (optional, defaults to `0`)     | `int`     | The x coordinate of the center of the spike.              |
| `centerZ` (optional, defaults to `0`)     | `int`     | The z coordinate of the center of the spike.              |
| `radius` (optional, defaults to `0`)      | `int`     | The radius of the spike.                                  |
| `height` (optional, defaults to `0`)      | `int`     | The height of the spike.                                  |
| `guarded` (optional, defaults to `false`) | `boolean` | Whether iron bars should be placed around the end crystal |

## Examples

As an example, here's the configured feature used to place the default end spikes on the main island:

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val END_SPIKE = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "end_spike",
        Feature.END_SPIKE,
        SpikeConfiguration(false, emptyList(), null) // (1)!
    )
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
        val END_SPIKE = FeatureRegistry.registerConfiguredFeature(
            Machines,
            "end_spike",
            Feature.END_SPIKE,
            SpikeConfiguration(
                false, // (1)!
                listOf(
                    Spike(42, 0, 2, 82, true), // (2)!
                    Spike(33, 24, 4, 94, false),
                    Spike(12, 39, 5, 103, false),
                    Spike(-13, 39, 2, 79, true),
                    Spike(-34, 24, 4, 97, false),
                    Spike(-42, -1, 3, 88, false),
                    Spike(-34, -25, 3, 91, false),
                    Spike(-13, -40, 3, 85, false),
                    Spike(12, -40, 4, 100, false),
                    Spike(33, -25, 2, 76, false)
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
    val END_SPIKE = FeatureRegistry.registerPlacedFeature(
        Machines,
        "end_spike",
        ConfiguredFeatures.END_SPIKE,
        BiomeFilter.biome() // (1)!
    )
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

![Example](https://i.imgur.com/ZId3oyv.jpeg)