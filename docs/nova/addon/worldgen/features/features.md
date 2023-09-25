# Features Overview

Features (sometimes also called decorators) are used to add additional decorations to the world (e.g. trees, ores, etc.).  
Most features are registered in 3 "steps":

### 1. Feature Type

The feature type is the logic behind the feature. It's the only part that needs to be written in code. Minecraft already
has a ton of default feature types (Although they're just called `Feature` in NMS). Check out the [Minecraft Wiki](https://minecraft.wiki/w/Custom_feature#Feature_Type)
for an up-to-date list of all feature types.

### 2. Configured Feature

Some feature types require additional configuration which determines what the feature will generate. For example, the 
`minecraft:ore` feature type requires a `minecraft:ore_configuration` to be defined. This configuration will determine 
stuff like: what block the ore will be placed in, how large the ore vein will be, etc. For more details on a specific 
configuration, check out its corresponding page in the sidebar. You can create configured feature files in the 
`data/worldgen/configured_feature` directory.

### 3. Placed Feature

A placed feature determines where and how a configured feature will be placed. You can create placed feature files in the
`data/worldgen/placed_feature` directory. You can find more information on the [Placed Feature](placed-feature.md) page.

## Using Features

To register a new feature, you'll always need a placed feature. When creating a new biome or adding it to an existing one,
you'll quickly notice that `features` is a 2d `JsonArray` instead of a 1-dimensional one. This is because Minecraft
generates different feature categories in a specific order. Below you'll find a list of all feature categories in the order
they're generated.

- raw_generation <small> (e.g. end islands) </small>
- lakes <small> (e.g. lava lakes) </small>
- local_modifications <small> (e.g. amethyst geodes) </small>
- underground_structures <small> (e.g. dungeons) </small>
- surface_structures <small> (e.g. villages) </small>
- strongholds <small> (not used anymore) </small>
- underground_ores
- underground_decoration <small> (e.g. sculk, also used for nether ores for some reason) </small>
- fluid_springs <small> (e.g. water springs) </small>
- vegetal_decoration <small> (e.g. trees, flowers) </small>
- top_layer_modification <small> (used for post-generation modifications, e.g. snow) </small>

Make sure to add your feature to the correct category, or it might not generate at all/get destroyed by another feature.

??? example "Example: Vanilla birch forest"

     As an example, here's the features `JsonArray` of the vanilla birch forest biome:

    ```json
    "features": [
        [],
        [
          "minecraft:lake_lava_underground",
          "minecraft:lake_lava_surface"
        ],
        [
          "minecraft:amethyst_geode"
        ],
        [
          "minecraft:monster_room",
          "minecraft:monster_room_deep"
        ],
        [],
        [],
        [
          "minecraft:ore_dirt",
          "minecraft:ore_gravel",
          "minecraft:ore_granite_upper",
          "minecraft:ore_granite_lower",
          "minecraft:ore_diorite_upper",
          "minecraft:ore_diorite_lower",
          "minecraft:ore_andesite_upper",
          "minecraft:ore_andesite_lower",
          "minecraft:ore_tuff",
          "minecraft:ore_coal_upper",
          "minecraft:ore_coal_lower",
          "minecraft:ore_iron_upper",
          "minecraft:ore_iron_middle",
          "minecraft:ore_iron_small",
          "minecraft:ore_gold",
          "minecraft:ore_gold_lower",
          "minecraft:ore_redstone",
          "minecraft:ore_redstone_lower",
          "minecraft:ore_diamond",
          "minecraft:ore_diamond_large",
          "minecraft:ore_diamond_buried",
          "minecraft:ore_lapis",
          "minecraft:ore_lapis_buried",
          "minecraft:ore_copper",
          "minecraft:underwater_magma",
          "minecraft:disk_sand",
          "minecraft:disk_clay",
          "minecraft:disk_gravel"
        ],
        [],
        [
          "minecraft:spring_water",
          "minecraft:spring_lava"
        ],
        [
          "minecraft:glow_lichen",
          "minecraft:forest_flowers",
          "minecraft:trees_birch",
          "minecraft:flower_default",
          "minecraft:patch_grass_forest",
          "minecraft:brown_mushroom_normal",
          "minecraft:red_mushroom_normal",
          "minecraft:patch_sugar_cane",
          "minecraft:patch_pumpkin"
        ],
        [
          "minecraft:freeze_top_layer"
        ]
    ]
    ```

Check out the [Biomes](../biome.md) page for more information on how to create a new biome. If you want to add your
feature to an existing biome, check out the [Biome Injections](../inject/biome.md) page.