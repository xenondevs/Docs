# Biome injections

!!! warning

    This worldgen page is still a work in progress. Some Json formats/code examples/features might be missing and will be
    added in the future.

`BiomeInjections` allow you to add [`PlacedFeatures`](../features/placed-feature.md) to an already existing biome. In the
future, this will also allow you to modify any other biome property.

## Example usage

Here's how you could inject the `star_shards_ore` `PlacedFeature` from Machines into all overworld biomes:

=== "Kotlin"

    ```kotlin title="BiomeInjections.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object BiomeInjections : BiomeRegistry by ExampleAddon.registry {
        
        private val OVERWORLD = biomeInjection("overworld")
            .biomes(BiomeTags.IS_OVERWORLD)
            .feature(Decoration.UNDERGROUND_ORES, PlacedFeatures.ORE_STAR_SHARDS)
            .register()
    
    }
    ```

=== "Json"

    ```json title="data/worldgen/inject/biome/overworld.json"
    {
      "biomes": "#minecraft:is_overworld",
      "features": [
        [],
        [],
        [],
        [],
        [],
        [],
        [
          "machines:ore_star_shards"
        ],
        [],
        [],
        [],
        []
      ]
    }
    ```