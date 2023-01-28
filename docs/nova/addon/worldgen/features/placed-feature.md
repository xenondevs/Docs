# Placed Features

A placed feature determines where and how a configured feature will be placed. Placed features work via placement modifiers 
that can be applied to a configured feature. 

You can create placed feature files in the `data/worldgen/placed_feature` directory or register them in the `FeatureRegistry`
in code.

## Structure

`feature`

:   The configured feature's id

`placement`

:   A list of placement modifiers. See [Placement Modifiers](#placement-modifiers) for more information. 

Here's an example of Minecraft's large diamond ore placed feature: 

=== "Kotlin"

    ```kotlin
    val ORE_DIAMOND_LARGE_PLACEMENT = FeatureRegistry.registerPlacedFeature(
        Machines,
        "ore_diamond_large",
        ORE_DIAMOND_LARGE_CONFIG, // (1)!
        listOf(
            RarityFilter.onAverageOnceEvery(9), // (2)!
            InSquarePlacement.spread(), // (3)!
            HeightRangePlacement.triangle(VerticalAnchor.aboveBottom(-80), VerticalAnchor.aboveBottom(80)), // (4)!
            BiomeFilter.biome() // (5)!
        )
    )
    ```

    1. The configured feature to place
    2. Only give the feature a chance of ${{}^{1}\!/_{9}}$ to generate
    3. Adds a random integer in the range $[0;15]$ to the x- and z-coordinates of the initial position
    4. Sets the y-coordinate to a value provided by the trapezoid height provider.  
       `triangle` is a shortcut for the trapezoid height provider with a plateau of width 0. This provider provides a y-coordinate in the range $[-80;80]$ below/above the bedrock layer via an isosceles trapezoidal distribution. Since blocks can't be placed under the bedrock layer, this again halves the chance of the feature generating.
    5. Only generates the feature in biomes that contain this feature <small>(the `in_square` placement modifiers might have generated a position in a different biome).</small>

=== "Json"

    ```json title="ore_diamond_large.json"
    {
      "feature": "minecraft:ore_diamond_large",
      "placement": [
        {
          "type": "minecraft:rarity_filter", // (1)!
          "chance": 9
        },
        {
          "type": "minecraft:in_square" // (2)!
        },
        {
          "type": "minecraft:height_range", // (3)!
          "height": {
            "type": "minecraft:trapezoid", // (4)!
            "max_inclusive": {
              "above_bottom": 80
            },
            "min_inclusive": {
              "above_bottom": -80
            }
          }
        },
        {
          "type": "minecraft:biome" // (5)!
        }
      ]
    }
    ```

    1. Only give the feature a chance of ${{}^{1}\!/_{9}}$ to generate
    2. Adds a random integer in the range $[0;15]$ to the x- and z-coordinates of the initial position
    3. Sets the y-coordinate to a value provided by the trapezoid height provider
    4. Provides a y-coordinate in the range $[-80;80]$ below/above the bedrock layer via an isosceles trapezoidal distribution. Since blocks can't be placed under the bedrock layer, this again halves the chance of the feature generating.
    5. Only generates the feature in biomes that contain this feature <small>(the `in_square` placement modifiers might have generated a position in a different biome).</small>

## Placement Modifiers

A Placement modifier takes an initial position and returns empty, one or more block positions. These modifiers are chained,
and pretty much act like a lot of `flatMap` calls. In fact, that's exactly what Minecraft does internally:

```java title="PlacedFeature.java"
private boolean placeWithContext(PlacementContext ctx, RandomSource random, BlockPos pos) {
    Stream<BlockPos> stream = Stream.of(pos);
    
    for (PlacementModifier placementmodifier : this.placement) {
        stream = stream.flatMap((blockPos) -> {
            return placementmodifier.getPositions(ctx, random, blockPos);
        });
    }
    
    // ...
}
```

So you can also think of these positions as attempts to place the configured feature. A list of vanilla placement
modifiers can be found below.

### `minecraft:biome`

Returns the position if the configured feature is registered in the biome's `feature` list at the given position. Empty
otherwise.

=== "Kotlin"

    ```kotlin title="Example"
    BiomeFilter.biome()
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:biome"
    }
    ```

### `minecraft:block_predicate_filter`

Returns the position if the [block predicate](#block-predicates) matches the block at the given position. Empty otherwise.

=== "Kotlin"

    ```kotlin title="Example"
    BlockPredicateFilter.forPredicate(BlockPredicate.matchesTag(BlockTags.STONE_ORE_REPLACEABLES))
    ```

=== "Json"

    | Name        | Description                              |
    |-------------|------------------------------------------|
    | `predicate` | The [block predicate](#block-predicates) |

    ```json title="Example"
    {
      "type": "minecraft:block_predicate_filter",
      "predicate": {
        "type": "minecraft:matching_block_tag",
        "tag": "minecraft:stone_ore_replaceables"
      }
    }
    ```

### `minecraft:carving_mask`

Returns all positions in the given position's chunk that were carved out by a [carver](../carvers.md).

=== "Kotlin"

    ```kotlin title="Example"
    CarvingMaskPlacement.forStep(GenerationStep.Carving.AIR)
    ```

=== "Json"

    | Name   | Description                               |
    |--------|-------------------------------------------|
    | `step` | The carver step. Can be `air` or `liquid` |
    
    ```json title="Example"
    {
      "type": "minecraft:carving_mask",
      "step": "air"
    }
    ```

### `minecraft:count`

Returns the given position `count` times.

=== "Kotlin"

    ```kotlin title="Example - Simple"
    CountPlacement.of(10)
    ```

    ```kotlin title="Example - Int Provider"
    CountPlacement.of(UniformInt.of(1, 10))
    ```

=== "Json"

    | Name    | Description                                                                                                                                           |
    |---------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
    | `count` | Either an `int` value in the range $[0;256]$ or an [int provider](#int-providers). The provided value is the number of times the position is returned |
    
    ```json title="Example - Simple"
    {
      "type": "minecraft:count",
      "count": 10
    }
    ```

    ```json title="Example - Int Provider"
    {
      "type": "minecraft:count",
      "count": {
        "type": "minecraft:uniform",
        "min_inclusive": 1,
        "max_inclusive": 10
      }
    }
    ```

### `minecraft:count_on_every_layer`

**Deprecated**. For more information, check out the [Minecraft Wiki](https://minecraft.fandom.com/wiki/Custom_feature#count_on_every_layer)

### `minecraft:environment_scan`

Scans for blocks matching the given [block predicate](#block-predicates) up/down until it finds a matching block or the
max number of steps is reached. If no matching block is found, empty is returned.

=== "Kotlin"

    ```kotlin title="Example"
    EnvironmentScanPlacement.scanningFor(
        Direction.DOWN, // Search direction
        BlockPredicate.solid(), // Target predicate
        BlockPredicate.matchesBlocks(Blocks.AIR, Blocks.WATER), // Allowed search predicate
        12 // Max steps
    )
    ```

=== "Json"

    | Name                                  | Description                                                                                                                                   |
    |---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
    | `direction_of_search`                 | The direction of the scan. Can be `up` or `down`                                                                                              |
    | `max_steps`                           | Max number of steps to scan. An `int` value in the range $[1;32]$                                                                             |
    | `target_condition`                    | The [block predicate](#block-predicates) to match                                                                                             |
    | `allowed_search_condition` (optional) | A [block predicate](#block-predicates) that each scanned block must match to allow further scanning. If not provided, no condition is applied |
    
    ```json title="Example"
    {
      "type": "minecraft:environment_scan",
      "direction_of_search": "down",
      "max_steps": 12,
      "target_condition": {
        "type": "minecraft:solid"
      },
      "allowed_search_condition": {
        "type": "minecraft:matching_blocks",
        "blocks": [
          "minecraft:air",
          "minecraft:water"
        ]
      }
    }
    ```

### `minecraft:height_range`

Takes the input position and sets the y coordinate to a value provided by the given [height provider](../height-provider.md).

=== "Kotlin"

    ```kotlin title="Example"
    HeightRangePlacement.triangle(VerticalAnchor.aboveBottom(-80), VerticalAnchor.aboveBottom(80))
    ```

=== "Json"

    | Name     | Description                                                             |
    |----------|-------------------------------------------------------------------------|
    | `height` | The [height provider](../height-provider.md) providing the y-coordinate |
    
    ```json title="Example"
    {
      "type": "minecraft:height_range",
      "height": {
        "type": "minecraft:trapezoid",
        "max_inclusive": {
          "above_bottom": 80
        },
        "min_inclusive": {
          "above_bottom": -80
        }
      }
    }
    ```

### `minecraft:heightmap`

Takes the input position and sets the y coordinate to one block above the heightmap at the given position. Check out the 
[heightmap gist page](https://gist.github.com/ByteZ1337/31f10b0052f44acfc177f40a0f0fe9cd) for image examples.

=== "Kotlin"

    ```kotlin title="Example"
    HeightmapPlacement.onHeightmap(Heightmap.Types.WORLD_SURFACE_WG)
    ```

=== "Json"

    | Name        | Description                                                                                                                                                                                                                                                                      |
    |-------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
    | `heightmap` | The heightmap to use. Can be `WORLD_SURFACE_WG`, `WORLD_SURFACE`, `OCEAN_FLOOR_WG`, `OCEAN_FLOOR`, `MOTION_BLOCKING` or `MOTION_BLOCKING_NO_LEAVES`. |
    
    ```json title="Example"
    {
      "type": "minecraft:heightmap",
      "heightmap": "WORLD_SURFACE_WG"
    }
    ```

### `minecraft:in_square`

Adds a random integer in the range $[0;15]$ to the x- and z-coordinates of the given position.

=== "Kotlin"

    ```kotlin title="Example"
    InSquarePlacement.spread()
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:in_square"
    }
    ```

### `minecraft:noise_based_count`

Gets the noise value at the given position and, if the value is positive, returns the given position multiple times. The
amount of times the position is returned is determined by the following code:
```java
double noise = Biome.BIOME_INFO_NOISE.getValue((double)pos.getX() / noiseFactor, (double)pos.getZ() / noiseFactor, false);
int n = (int)Math.ceil((noise + noiseOffset) * noiseToCountRatio);
```

=== "Kotlin"

    ```kotlin title="Example"
    NoiseBasedCountPlacement.of(
        160, // Noise to count ratio
        80.0, // Noise factor
        .3 // Noise offset
    )
    ```

=== "Json"

    | Name                      | Description                                                                                     |
    |---------------------------|-------------------------------------------------------------------------------------------------|
    | `noise_factor`            | A `double` value that scales the noise horizontally. The higher the value, the wider the peaks. |
    | `noise_offset` (optional) | A `double` value that offsets the noise vertically.                                             |
    | `noise_to_count_ratio`    | An `int` value that defines the ratio of noise to count.                                        |
    
    ```json title="Example"
    {
      "type": "minecraft:noise_based_count"
      "noise_factor": 80.0,
      "noise_offset": 0.3,
      "noise_to_count_ratio": 160,
    }
    ```

### `minecraft:noise_threshold_count`

Returns the given position multiple times. If the noise value at the given position is below the given threshold, the
position is returned `below_noise` times. Otherwise, it is returned `above_noise` times. Or, in code:

```java
if (noise < threshold) {
  return below_noise;
} else {
  return above_noise;
}
```

=== "Kotlin"

    ```kotlin title="Example"
    NoiseThresholdCountPlacement.of(
        -0.8, // Noise level
        5, // Below noise
        10 // Above noise
    )
    ```

=== "Json"

    | Name          | Description                                                                                                              |
    |---------------|--------------------------------------------------------------------------------------------------------------------------|
    | `noise_level` | A `double` value of the threshold that determines whether the position is returned `below_noise` or `above_noise` times. |
    | `above_noise` | An `int` value that determines how often the position is returned if the noise value is above/equal to the threshold.    |
    | `below_noise` | An `int` value that determines how often the position is returned if the noise value is below the threshold.             |
    
    ```json title="Example"
    {
      "type": "minecraft:noise_threshold_count",
      "noise_level": -0.8
      "above_noise": 10,
      "below_noise": 5,
    }
    ```

### `minecraft:random_offset`

Offsets the given position by the provided [int provider's](#int-providers) values.

=== "Kotlin"

    ```kotlin title="Example"
    RandomOffsetPlacement.of(ConstantInt.ZERO, UniformInt.of(3, 9))
    ```

=== "Json"

    | Name        | Description                                                                                                                  |
    |-------------|------------------------------------------------------------------------------------------------------------------------------|
    | `xz_spread` | Either a fixed `int` value in the range $[-16;16]$ or an [int provider](#int-providers). **x and z are sampled separately!** |
    | `y_spread`  | Either a fixed `int` value in the range $[-16;16]$ or an [int provider](#int-providers).                                     |
    
    ```json title="Example"
    {
      "type": "minecraft:random_offset",
      "xz_spread": 0,
      "y_spread": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 9,
          "min_inclusive": 3
        }
      }
    }
    ```

### `minecraft:rarity_filter`

Either returns the given position or empty. The chance of returning the position is determined by the given chance and
calculated via `1 / chance`.

=== "Kotlin"

    ```kotlin title="Example"
    RarityFilter.onAverageOnceEvery(9)
    ```

=== "Json"

    | Name     | Description                                                            |
    |----------|------------------------------------------------------------------------|
    | `chance` | A positive `int` that determines the chance of returning the position. |
    
    ```json title="Example"
    {
      "type": "minecraft:rarity_filter",
      "chance": 9
    }
    ```

### `minecraft:surface_relative_threshold_filter`

Returns the given position if the surface height at the given position is inside the specified range. Otherwise, returns empty.
Check out the [heightmap gist page](https://gist.github.com/ByteZ1337/31f10b0052f44acfc177f40a0f0fe9cd) for image examples.

=== "Kotlin"

    ```kotlin title="Example"
    SurfaceRelativeThresholdFilter.of(
        Heightmap.Types.OCEAN_FLOOR_WG,
        Int.MIN_VALUE, // min
        -2 // max
    )
    ```

=== "Json"

    | Name            | Description                                                                                                                                                                                                                                                                      |
    |-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
    | `heightmap`     | The heightmap to use. Can be `WORLD_SURFACE_WG`, `WORLD_SURFACE`, `OCEAN_FLOOR_WG`, `OCEAN_FLOOR`, `MOTION_BLOCKING` or `MOTION_BLOCKING_NO_LEAVES`. |
    | `max_inclusive` | A `double` value that defines the maximum surface level. Defaults to $2^{31} - 1$.                                                                                                                                                                                               |
    | `min_inclusive` | A `double` value that defines the minimum surface level. Defaults to $-2^{31}$.                                                                                                                                                                                                  |
    
    ```json title="Example"
    {
      "type": "minecraft:surface_relative_threshold_filter",
      "heightmap": "OCEAN_FLOOR_WG",
      "max_inclusive": -2
    }
    ```

### `minecraft:surface_water_depth_filter`

If the amount of motion-blocking blocks under the surface is less than/equal to `max_water_depth`, returns the given position. Otherwise, returns empty.

=== "Kotlin"

    ```kotlin title="Example"
    SurfaceWaterDepthFilter.forMaxDepth(2)
    ```

=== "Json"

    | Name              | Description                                  |
    |-------------------|----------------------------------------------|
    | `max_water_depth` | An `int` defining the maximum allowed depth. |
    
    ```json title="Example"
    {
      "type": "minecraft:surface_water_depth_filter",
      "max_water_depth": 2
    }
    ```

# TODO \/ move to different section \/

## Block predicates

## Int Providers

## Float Providers