# Multiface growth feature

The `multiface_growth` feature is used to generate plants that grow on multiple faces of a block (for example sculk or
glow lichen).

## Configuration

The `multiface_growth` feature has the following configuration options:

| Option                                                        | Type                                                                                     | Description                                           |
|---------------------------------------------------------------|------------------------------------------------------------------------------------------|-------------------------------------------------------|
| `block` (optional in Json, defaults to `glow_lichen`          | A `String`. Either `glow_lichen` or `sculk_vein`.                                        | The block to generate.                                |
| `search_range` (optional in Json, defaults to `10`)           | An `int`. (Range limit in Json is $[1;64]$)                                              | The search range for the next block to grow on.       |
| `can_place_on_floor` (optional in Json, defaults to `false`)  | A `boolean`.                                                                             | Whether the plant can grow on the floor.              |
| `can_place_on_ceiling` (optional in Json, defaults to `true`) | A `boolean`.                                                                             | Whether the plant can grow on the ceiling.            |
| `can_place_on_wall` (optional in Json, defaults to `true`)    | A `boolean`.                                                                             | Whether the plant can grow on the wall.               |
| `can_be_placed_on`                                            | A list of blocks. (Also supports a single block id, block tag or a list of them in Json) | The blocks the plant can grow on.                     |
| `chance_of_spreading` (optional in Json, defaults to `0.5`)   | A `float`. (Range limit in Json is $[0.0;1.0]$)                                          | The chance that the plant will spread to a new block. |

In code, the `MultifaceGrowthConfiguration` class is used to configure the feature.

## Example

As an example, here's the configured- and placed feature for sculk veins.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SCULK_VEIN = registerConfiguredFeature(
            "sculk_vein",
            Feature.MULTIFACE_GROWTH,
            MultifaceGrowthConfiguration(
                Blocks.SCULK_VEIN as MultifaceBlock, // block to use
                20, // search range
                true, // canPlaceOnFloor
                true, // canPlaceOnCeiling
                true, // canPlaceOnWall
                1.0F, // chanceOfSpreading // (1)!
                HolderSet.direct( // (2)!
                    Block::builtInRegistryHolder,
                    Blocks.STONE, Blocks.ANDESITE, Blocks.DIORITE, Blocks.GRANITE, Blocks.DRIPSTONE_BLOCK, Blocks.CALCITE, Blocks.TUFF, Blocks.DEEPSLATE
                )
            )
        )
    
    }
    ```

    1. Combined with the search range of 20, this ensures that every block in a 20 block radius will have a sculk vein.
    2. Only grow on typical cave blocks.

    ```kotlin title="PlacedFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val SCULK_VEIN = placedFeature("sculk_vein", ConfiguredFeatures.SCULK_VEIN)
            .count(UniformInt.of(204, 250)) // (1)!
            .inSquareSpread() // (2)!
            .inYWorldBounds() // (3)!
            .biomeFilter() // (4)!
            .register()
    
    }
    ```

    1. Generate 204-250 attempts per chunk.
    2. Randomly offset the attempts horizontally.
    3. Set the y-level to a random int up to 256. The call is equivalent to
       ```kotlin
       HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(256));
       ```
    4. Only generate in biomes that have sculk growth.

=== "Json"

    ```json title="configured_feature/sculk_vein.json"
    {
      "type": "minecraft:multiface_growth",
      "config": {
        "block": "minecraft:sculk_vein",
        "search_range": 20,
        "chance_of_spreading": 1.0, // (1)! 
        "can_place_on_floor": true,
        "can_place_on_ceiling": true,
        "can_place_on_wall": true,
        "can_be_placed_on": [ // (2)!
          "minecraft:stone",
          "minecraft:andesite",
          "minecraft:diorite",
          "minecraft:granite",
          "minecraft:dripstone_block",
          "minecraft:calcite",
          "minecraft:tuff",
          "minecraft:deepslate"
        ]
      }
    }
    ```

    1. Grow on every block in a 20 block radius.
    2. Only grow on typical cave blocks.
    
    ```json title="placed_feature/sculk_vein.json"
    {
      "feature": "minecraft:sculk_vein",
      "placement": [
        {
          "type": "minecraft:count", // (1)!
          "count": {
            "type": "minecraft:uniform",
            "value": {
              "max_inclusive": 250,
              "min_inclusive": 204
            }
          }
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
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. Generate 204-250 attempts per chunk.
    2. Randomly offset the attempts horizontally.
    3. Set the y-level to a random int up to 256.
    4. Only generate in biomes that have sculk growth.

## Result

![Example](https://i.imgur.com/yq5KlVA.png)