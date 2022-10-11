# Placed Features

A placed feature determines where and how a configured feature will be placed. Placed features work via placement modifiers 
that can be applied to a configured feature. 

You can create placed feature files in the `data/worldgen/placed_feature` directory.

## Structure

`feature`

:   The configured features id

`placement`

:   A list of placement modifiers. A Placement modifier takes the initial place position and returns empty or one or more
    block positions. Since these placement modifiers are chained, you can think of these positions as attempts to place 
    the configured feature at the given position. A list of vanilla placement modifiers can be found below. 

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
5. Only generates the feature in biomes that contain this feature (step 2 might have generated a position inside a different biome).

## Placement Modifiers