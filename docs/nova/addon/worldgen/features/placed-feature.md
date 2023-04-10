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
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacedFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val ORE_DIAMOND_LARGE_PLACEMENT = placedFeature("ore_diamond_large", OreFeatures.ORE_DIAMOND_LARGE) // (1)!
            .rarityFilter(9) // (2)!
            .inSquareSpread() // (3)!
            .heightRangeTriangle(VerticalAnchor.aboveBottom(-80), VerticalAnchor.aboveBottom(80)) // (4)!
            .biomeFilter() // (5)!
            .register()
    
    }
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

Returns the position if the [block predicate](../types/block-predicate.md) matches the block at the given position. Empty otherwise.

| Name        | Description                                         |
|-------------|-----------------------------------------------------|
| `predicate` | The [`BlockPredicate`](../types/block-predicate.md) |

=== "Kotlin"

    ```kotlin title="Example"
    BlockPredicateFilter.forPredicate(BlockPredicate.matchesTag(BlockTags.STONE_ORE_REPLACEABLES))
    ```

=== "Json"

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

Returns all positions in the given position's chunk that were carved out by a [carver](../carver.md).

| Name   | Description                               |
|--------|-------------------------------------------|
| `step` | The carver step. Can be `air` or `liquid` |

=== "Kotlin"

    ```kotlin title="Example"
    CarvingMaskPlacement.forStep(GenerationStep.Carving.AIR)
    ```

=== "Json"
    
    ```json title="Example"
    {
      "type": "minecraft:carving_mask",
      "step": "air"
    }
    ```

### `minecraft:count`

Returns the given position `count` times.

| Name    | Description                                                                                                                                                        |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `count` | An [`IntProvider`](../types/number-provider.md#intprovider) (Range limit in Json is $[0;256]$). The provided value is the number of times the position is returned |

=== "Kotlin"

    ```kotlin title="Example - Simple"
    CountPlacement.of(10)
    ```

    ```kotlin title="Example - Int Provider"
    CountPlacement.of(UniformInt.of(1, 10))
    ```

=== "Json"

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

Scans for blocks matching the given [block predicate](../types/block-predicate.md) up/down until it finds a matching block or the
max number of steps is reached. If no matching block is found, empty is returned.

| Name                                  | Description                                                                                                                |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `direction_of_search`                 | The direction of the scan. Can be `up` or `down`                                                                           |
| `target_condition`                    | The [`BlockPredicate`](../types/block-predicate.md) to match                                                               |
| `allowed_search_condition` (optional) | A `BlockPredicate` that each scanned block must match to allow further scanning. If not provided, no condition is applied. |
| `max_steps`                           | An `int` that determines the max number of steps. (Range limit in Json is $[1;32]$)                                        |

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

Takes the input position and sets the y coordinate to a value provided by the given [height provider](../types/height-provider.md).

| Name     | Description                                                                    |
|----------|--------------------------------------------------------------------------------|
| `height` | The [`HeightProvider`](../types/height-provider.md) providing the y-coordinate |

=== "Kotlin"

    ```kotlin title="Example"
    HeightRangePlacement.triangle(VerticalAnchor.aboveBottom(-80), VerticalAnchor.aboveBottom(80))
    ```

=== "Json"

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

Takes the input position and sets the y coordinate to one block above the heightmap at the given position.  
Check out the [heightmap gist page](https://gist.github.com/ByteZ1337/31f10b0052f44acfc177f40a0f0fe9cd) for image examples.

| Name        | Description                                                                                                                                               |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `heightmap` | The heightmap type to use. Can be `WORLD_SURFACE_WG`, `WORLD_SURFACE`, `OCEAN_FLOOR_WG`, `OCEAN_FLOOR`, `MOTION_BLOCKING` or `MOTION_BLOCKING_NO_LEAVES`. |

=== "Kotlin"

    ```kotlin title="Example"
    HeightmapPlacement.onHeightmap(Heightmap.Types.WORLD_SURFACE_WG)
    ```

=== "Json"
    
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
int count = (int)Math.ceil((noise + noiseOffset) * noiseToCountRatio);
```

| Name                              | Description                                                                               |
|-----------------------------------|-------------------------------------------------------------------------------------------|
| `noise_to_count_ratio`            | An `int` that defines the ratio of noise to count.                                        |
| `noise_factor`                    | A `double` that scales the noise horizontally. The higher the value, the wider the peaks. |
| `noise_offset` (optional in Json) | A `double` that offsets the noise vertically.                                             |

=== "Kotlin"

    ```kotlin title="Example"
    NoiseBasedCountPlacement.of(
        160, // Noise to count ratio
        80.0, // Noise factor
        .3 // Noise offset
    )
    ```

=== "Json"
    
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
} else { // noise >= threshold
  return above_noise;
}
```

| Name          | Description                                                                                                              |
|---------------|--------------------------------------------------------------------------------------------------------------------------|
| `noise_level` | A `double` value of the threshold that determines whether the position is returned `below_noise` or `above_noise` times. |
| `below_noise` | An `int` that determines how often the position is returned if the noise value is below the threshold.                   |
| `above_noise` | An `int` that determines how often the position is returned if the noise value is above/equal to the threshold.          |

=== "Kotlin"

    ```kotlin title="Example"
    NoiseThresholdCountPlacement.of(
        -0.8, // Noise level
        5, // Below noise
        10 // Above noise
    )
    ```

=== "Json"
    
    ```json title="Example"
    {
      "type": "minecraft:noise_threshold_count",
      "noise_level": -0.8
      "above_noise": 10,
      "below_noise": 5,
    }
    ```

### `minecraft:random_offset`

Offsets the given position by the provided [`IntProvider's`](../types/number-provider.md#intprovider) values.

| Name        | Description                                                                                                                           |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `xz_spread` | An [`IntProvider`](../types/number-provider.md#intprovider). (Range limit in Json is $[-16;16]$). **x and z are sampled separately!** |
| `y_spread`  | An `IntProvider`. (Range limit in Json is $[-16;16]$).                                                                                |

=== "Kotlin"

    ```kotlin title="Example"
    RandomOffsetPlacement.of(ConstantInt.ZERO, UniformInt.of(3, 9))
    ```

=== "Json"
    
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

| Name     | Description                                                                     |
|----------|---------------------------------------------------------------------------------|
| `chance` | A positive `int` that determines the average amount of tries between a success. |

=== "Kotlin"

    ```kotlin title="Example"
    RarityFilter.onAverageOnceEvery(9)
    ```

=== "Json"
    
    ```json title="Example"
    {
      "type": "minecraft:rarity_filter",
      "chance": 9
    }
    ```

### `minecraft:surface_relative_threshold_filter`

Returns the given position if the surface height at the given position is inside the specified range. Otherwise, returns empty.  
Check out the [heightmap gist page](https://gist.github.com/ByteZ1337/31f10b0052f44acfc177f40a0f0fe9cd) for image examples.

| Name                                                         | Description                                                                                                                                          |
|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `heightmap`                                                  | The heightmap to use. Can be `WORLD_SURFACE_WG`, `WORLD_SURFACE`, `OCEAN_FLOOR_WG`, `OCEAN_FLOOR`, `MOTION_BLOCKING` or `MOTION_BLOCKING_NO_LEAVES`. |
| `min_inclusive` (Optional in Json, defaults to $-2^{31}$)    | A `double` value that defines the minimum surface level.                                                                                             |
| `max_inclusive` (Optional in Json, defaults to $2^{31} - 1$) | A `double` value that defines the maximum surface level.                                                                                             |

=== "Kotlin"

    ```kotlin title="Example"
    SurfaceRelativeThresholdFilter.of(
        Heightmap.Types.OCEAN_FLOOR_WG,
        Int.MIN_VALUE, // min
        -2 // max
    )
    ```

=== "Json"
    
    ```json title="Example"
    {
      "type": "minecraft:surface_relative_threshold_filter",
      "heightmap": "OCEAN_FLOOR_WG",
      "max_inclusive": -2
    }
    ```

### `minecraft:surface_water_depth_filter`

If the amount of motion-blocking blocks under the surface is less than/equal to `max_water_depth`, returns the given position. Otherwise, returns empty.

| Name              | Description                                  |
|-------------------|----------------------------------------------|
| `max_water_depth` | An `int` defining the maximum allowed depth. |

=== "Kotlin"

    ```kotlin title="Example"
    SurfaceWaterDepthFilter.forMaxDepth(2)
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:surface_water_depth_filter",
      "max_water_depth": 2
    }
    ```

### Custom `PlacementModifiers`

You can also implement your own custom `PlacementModifiers` by extending Minecraft's `PlacementModifier` class. You can
then register your custom `PlacementModifier` via the `FeatureRegistry` either by creating a `PlacementModifierType` or
by providing the `Codec` directly and thus creating an inline `PlacementModifierType`. Check out the [Codecs](../codecs)
page for more information on Mojang's serialization system.  
Here's how you'd implement the [`minecraft:count`](#minecraftcount) `PlacementModifier` as an example:

=== "Inline PlacementModifierType"

    ```kotlin title="PlacementModifiers.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacementModifiers : FeatureRegistry by ExampleAddon.registry {
    
        val COUNT_PLACEMENT = registerPlacementModifierType("count", CountPlacement.CODEC)
    
    }
    ```
    
    ```kotlin title="CountPlacement.kt"
    class CountPlacement(val count: IntProvider) : PlacementModifier() {
        
        override fun getPositions(ctx: PlacementContext, random: RandomSource, pos: BlockPos): Stream<BlockPos> =
            Stream.generate { pos }.limit(count.sample(random).toLong())
        
        override fun type(): PlacementModifierType<*> = PlacementModifiers.COUNT_PLACEMENT
        
        companion object {
            
            @JvmField // (1)!
            val CODEC: Codec<CountPlacement> = IntProvider
                .codec(0, 256)
                .fieldOf("count")
                .xmap(::CountPlacement, CountPlacement::count)
                .codec()
            
            @JvmStatic
            fun of(count: Int) = CountPlacement(ConstantInt.of(count))
            
            @JvmStatic
            fun of(count: IntProvider) = CountPlacement(count)
        
        }
    
    }
    ```

    1. This allows `CODEC` to be accessed as a field from Java code instead of having to call `getCODEC()`

=== "PlacementModifierType object"

    ```kotlin title="CountPlacement.kt"
    object CountPlacementType : PlacementModifierType<CountPlacement> {
        
        private val CODEC: Codec<CountPlacement> = IntProvider
            .codec(0, 256)
            .fieldOf("count")
            .xmap(::CountPlacement, CountPlacement::count)
            .codec()
        
        override fun codec() = CODEC
        
    }
    ```
    
    ```kotlin title="PlacementModifiers.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init
    object PlacementModifiers : FeatureRegistry by ExampleAddon.registry {
    
        val COUNT_PLACEMENT = registerPlacementModifierType("count", CountPlacementType)
    
    }
    ```
    
    ```kotlin title="CountPlacement.kt"
    class CountPlacement(val count: IntProvider) : PlacementModifier() {
        
        override fun getPositions(ctx: PlacementContext, random: RandomSource, pos: BlockPos): Stream<BlockPos> =
            Stream.generate { pos }.limit(count.sample(random).toLong())
        
        override fun type(): PlacementModifierType<*> = CountPlacementType
        
        companion object {
            
            @JvmStatic
            fun of(count: Int) = CountPlacement(ConstantInt.of(count))
            
            @JvmStatic
            fun of(count: IntProvider) = CountPlacement(count)
        
        }
        
    }
    ```

Minecraft also offers further abstraction via the `RepeatingPlacement` and `PlacementFilter` classes. They both override
the `getPositions` method and provide the `count` and `shouldPlace` methods respectively.

## Inlined

Some placed features might not be worth registering in the `Registry` (e.g. `fill_layer` features for flat worlds). In
such cases, `#!kotlin PlacementUtils.inlinePlaced` can be used to get a `Holder` that contains a `PlacedFeature` constructed
from the `ConfiguredFeature` and `PlacementModifiers` provided.

As an example, here's how `fill_layer` placed features are inlined in Minecraft's flat level generator:

```java title="FlatLevelGeneratorSettings.java"
/* ... */

for (layer = 0; layer < layers.size(); ++layer) {
    BlockState blockstate = layers.get(layer);

    if (!Heightmap.Types.MOTION_BLOCKING.isOpaque().test(blockstate)) {
        layers.set(layer, null);
        builder.addFeature(GenerationStep.Decoration.TOP_LAYER_MODIFICATION, PlacementUtils.inlinePlaced(Feature.FILL_LAYER, new LayerConfiguration(layer, blockstate)));
    }
}

/* ... */
```