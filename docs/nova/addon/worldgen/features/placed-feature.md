# Placed Features

A placed feature determines where and how a configured feature will be placed. Placed features work via placement modifiers 
that can be applied to a configured feature. 

You can create placed feature files in the `data/worldgen/placed_feature` directory.

## Structure

`feature`

:   The configured features id

`placement`

:   A list of placement modifiers. See [Placement Modifiers](#placement-modifiers) for more information. 

Here's an example of minecraft's large diamond ore placed feature: 

```json title="ore_diamond_large.json"
{
  "feature": "minecraft:ore_diamond_large",
  "placement": [
    {
      "type": "minecraft:rarity_filter", // (1)
      "chance": 9
    },
    {
      "type": "minecraft:in_square" // (2)
    },
    {
      "type": "minecraft:height_range", // (3)
      "height": {
        "type": "minecraft:trapezoid", // (4)
        "max_inclusive": {
          "above_bottom": 80
        },
        "min_inclusive": {
          "above_bottom": -80
        }
      }
    },
    {
      "type": "minecraft:biome" // (5)
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
and pretty much act like a lot of `flatMap` calls. In fact, that's exactly what Minecraft internally does:

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

```json title="Example"
{
  "type": "minecraft:biome"
}
```

### `minecraft:block_predicate_filter`

Returns the position if the [block predicate](#block-predicates) matches the block at the given position. Empty otherwise.

`predicate`

:   The [block predicate](#block-predicates)

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

`step`

:   The carver step. Can be `air` or `liquid`

```json title="Example"
{
  "type": "minecraft:carving_mask",
  "step": "air"
}
```

### `minecraft:count`

Returns the given position `count` times.

`count`

:   Either an `int` value in the range $[0;256]$ or an [int provider](#int-providers). The provided value is the number of times the position is returned

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

# TODO \/ move to different section \/

## Block predicates

## Int Providers
