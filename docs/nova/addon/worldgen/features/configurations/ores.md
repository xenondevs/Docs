# Ore features

Ore features are used to generate ores in the world. They are configured using the `ore` or `scattered_ore` feature types
(`ore` is recommended for most cases).

## Configuration

The following options are available for ore configurations:

| Option                           | Type                            | Description                                                                                                                        |
|----------------------------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `size`                           | An `int` in the range $[0;64]$. | Determines the volume size of the ore.                                                                                             |
| `discard_chance_on_air_exposure` | A `float` in the range $[0;1]$. | Determines the chance that the ore will be discarded if it is exposed to air. `1` means that the ore will never be exposed to air. |
| `targets`                        | A list of `TargetBlockState`s   | A list which determines what block to use for specific targets. Needs a `target` and a `state` option. See below for more details. |

In code, the `OreConfiguration` class is used to configure the feature.

### Targets

As mentioned above, the `targets` option is a list of targets. The `target` option is a so called`RuleTest`. A `RuleTest` is 
pretty much the same thing as `Predicate<BlockState>` in Java. The `state` option is a [`BlockStateProvider`](../../block-state-provider.md)
which determines what block to use for the specific target.  
The following `RuleTest`s are available:

<table>
    <thead>
    <tr>
        <th style="width: 30%">Name</th>
        <th style="width: 30%">Description</th>
        <th style="width: 40%">Example</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>minecraft:always_true</code></td>
        <td>Matches every block</td>
        <td>
            ```kotlin
            AlwaysTrueTest.INSTANCE
            ```
            ```json
            "target": {
              "predicate_type": "minecraft:always_true"
            }
            ```
        </td>
    </tr>
    <tr>
        <td><code>minecraft:block_match</code></td>
        <td>Matches a specific block</td>
        <td>
            ```kotlin
            BlockMatchTest(Blocks.STONE)
            ```
            ```json
            "target": {
              "predicate_type": "minecraft:block_match",
              "block": "minecraft:stone"
            }
            ```
            
            <code>block</code> also supports Nova blocks.
        </td>
    </tr>
    <tr>
        <td><code>minecraft:blockstate_match</code></td>
        <td>Matches a specific blockstate</td>
        <td>
            ```kotlin
            BlockStateMatchTest(
                Blocks.GLASS_PANE.defaultBlockState()
                    .setValue(IronBarsBlock.EAST, true)
                    .setValue(IronBarsBlock.WEST, true)
            )
            ```
            ```json
            "target": {
              "predicate_type": "minecraft:blockstate_match",
              "block_state": {
                "Name": "minecraft:glass_pane",
                "Properties": {
                  "east": "true",
                  "north": "false",
                  "south": "false",
                  "waterlogged": "false",
                  "west": "true"
                }
              }
            }
            ```
        </td>
    </tr>
    <tr>
        <td><code>minecraft:tag_match</code></td>
        <td>Matches a specific <a href="https://minecraft.fandom.com/wiki/Tag#Blocks">block tag</a></td>
        <td>
            ```kotlin
            TagMatchTest(BlockTags.STONE_ORE_REPLACEABLES)
            ```
            ```json
            "target": {
              "predicate_type": "minecraft:tag_match",
              "tag": "minecraft:stone_ore_replaceables"
            }
            ```
        </td>
    </tr>
    <tr>
        <td><code>minecraft:random_block_match</code></td>
        <td>Matches the given block with a probability. The probability should be a value between 0.0 and 1.0.</td>
        <td>
            ```kotlin
            RandomBlockMatchTest(Blocks.COBBLESTONE, 0.5f)
            ```
            ```json
            "target": {
              "predicate_type": "minecraft:random_block_match",
              "block": "minecraft:cobblestone",
              "probability": 0.5
            }
            ```
        </td>
    </tr>
    <tr>
        <td><code>minecraft:random_blockstate_match</code></td>
        <td>Matches the given blockstate with a probability. The probability should be a value between 0.0 and 1.0.</td>
        <td>
            ```kotlin
            RandomBlockStateMatchTest(
                Blocks.GLASS_PANE.defaultBlockState()
                    .setValue(IronBarsBlock.EAST, true)
                    .setValue(IronBarsBlock.WEST, true),
                0.5f
            )
            ```
            ```json
            "target": {
              "predicate_type": "minecraft:random_blockstate_match",
              "block_state": {
                "Name": "minecraft:glass_pane",
                "Properties": {
                  "east": "true",
                  "north": "false",
                  "south": "false",
                  "waterlogged": "false",
                  "west": "true"
                }
              }
              "probability": 0.5
            }
            ```
        </td>
    </tr>
    </tbody>
</table>

## Example

As an example, here's the configured- and placed feature of star shards ore from the machines addon.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    val ORE_STAR_SHARDS = FeatureRegistry.registerConfiguredFeature(
        Machines,
        "ore_star_shards",
        Feature.ORE,
        OreConfiguration(
            listOf( // (1)!
                OreConfiguration.target(
                    TagMatchTest(BlockTags.STONE_ORE_REPLACEABLES),
                    WrapperBlockState(Blocks.STAR_SHARDS_ORE)
                ),
                OreConfiguration.target(
                    TagMatchTest(BlockTags.DEEPSLATE_ORE_REPLACEABLES),
                    WrapperBlockState(Blocks.DEEPSLATE_STAR_SHARDS_ORE)
                )
            ),
            4, // (2)!
            0.0f // (3)!
        )
    )
    ```

    1. Specify that `star_shards_ore` should be used to replace normal stone and `deepslate_star_shards_ore` should be used to replace deepslate.
    2. The size of the ore vein.
    3. The chance that the ore will be discarded if it's exposed to air.

    For placements, it's pretty useful to define a few util functions to create the `PlacementModifier` list.
    
    ```kotlin title="PlacedFeatures.kt"
    private fun orePlacement(firstModifier: PlacementModifier, lastModifier: PlacementModifier) =
        listOf(firstModifier, InSquarePlacement.spread(), lastModifier, BiomeFilter.biome())
    
    /**
     * @param count The amount of ores per chunk
     */
    private fun commonOrePlacement(count: Int, lastModifier: PlacementModifier) =
        orePlacement(CountPlacement.of(count), lastModifier)
    
    /**
     * @param chance The chance of an ore to spawn per chunk. 7 = 1 in 7 chunks
     */
    private fun rareOrePlacement(chance: Int, lastModifier: PlacementModifier) =
        orePlacement(RarityFilter.onAverageOnceEvery(chance), lastModifier)
    ```

    ??? example "Vanilla ore placement examples"
    
        ```kotlin
        // ore_iron_upper
        commonOrePlacement(90, HeightRangePlacement.triangle(VerticalAnchor.absolute(80), VerticalAnchor.absolute(384)))
        // ore_iron_middle
        commonOrePlacement(10, HeightRangePlacement.triangle(VerticalAnchor.absolute(-24), VerticalAnchor.absolute(56)))
        // ore_iron_small
        commonOrePlacement(10, HeightRangePlacement.uniform(VerticalAnchor.bottom(), VerticalAnchor.absolute(72)))
    
        // ore_diamond
        commonOrePlacement(7, HeightRangePlacement.triangle(VerticalAnchor.aboveBottom(-80), VerticalAnchor.aboveBottom(80)))
        // ore_diamond_large
        rareOrePlacement(9, HeightRangePlacement.triangle(VerticalAnchor.aboveBottom(-80), VerticalAnchor.aboveBottom(80)))
        // ore_diamond_buried
        commonOrePlacement(4, HeightRangePlacement.triangle(VerticalAnchor.aboveBottom(-80), VerticalAnchor.aboveBottom(80)))
        ```

    ```kotlin title="PlacedFeatures.kt"
    val ORE_STAR_SHARDS = FeatureRegistry.registerPlacedFeature(
        Machines,
        "ore_star_shards",
        ConfiguredFeatures.ORE_STAR_SHARDS,
        commonOrePlacement(30, HeightRangePlacement.uniform(VerticalAnchor.absolute(120), VerticalAnchor.top())) // (1)!
    )
    ```

    1. 30 tries per chunk and only place the ore at a high altitude (y>120).

=== "Json"

    ```json title="configured_feature/ore_star_shards.json"
    {
      "type": "minecraft:ore",
      "config": {
        "discard_chance_on_air_exposure": 0.0,
        "size": 4,
        "targets": [ // (1)!
          {
            "state": {
              "Name": "machines:star_shards_ore"
            },
            "target": {
              "predicate_type": "minecraft:tag_match",
              "tag": "minecraft:stone_ore_replaceables"
            }
          },
          {
            "state": {
              "Name": "machines:deepslate_star_shards_ore"
            },
            "target": {
              "predicate_type": "minecraft:tag_match",
              "tag": "minecraft:deepslate_ore_replaceables"
            }
          }
        ]
      }
    ```

    1. Specify that `star_shards_ore` should be used to replace normal stone and `deepslate_star_shards_ore` should be used to replace deepslate.

    ```json title="placed_feature/ore_star_shards.json"
    {
      "feature": "machines:ore_star_shards",
      "placement": [
        {
          "type": "minecraft:count",
          "count": 30 // (1)!
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:height_range", // (3)!
          "height": {
            "type": "minecraft:uniform",
            "max_inclusive": {
              "below_top": 0
            },
            "min_inclusive": {
              "absolute": 120
            }
          }
        },
        {
          "type": "minecraft:biome" // (4)!
        }
      ]
    }
    ```

    1. 30 tries per chunk.
    2. Spread the tries in a square.
    3. Place the ore above y-level 119.
    4. Discard the try if we moved into a biome that doesn't generate star shards.