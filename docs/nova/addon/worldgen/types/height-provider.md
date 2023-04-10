# Height Providers

Height providers are used to get a height value for a given position. Before we can get into the details however, we first
need to take a look at `VerticalAnchors`.

## Vertical Anchors

Vertical anchors are used to get a fixed height value depending on factors like the min and max build height. There is 
of course also a constant implementation that always returns the same value. Please note that the type doesn't have to 
be specified in Json. It's automatically inferred via the key name.

!!! warning

    All specified values need to be within the the min and max build height of the world.

### `absolute`

Always returns the same y-value.

=== "Kotlin"

    ```kotlin title="Example"
    VerticalAnchor.absolute(10)
    ```

=== "Json"

    ```json title="Example"
    {
      "absolute": 10
    }
    ```

### `above_bottom`

Returns a y-value above the min build height of the world by `above_bottom` blocks.

=== "Kotlin"

    ```kotlin title="Example"
    VerticalAnchor.aboveBottom(5)
    ```

    !!! tip
    
        If you want to get the minimum build height, you can also use `#!kotlin VerticalAnchor.bottom()` or
        `#!kotlin VerticalAnchor.BOTTOM` instead of `#!kotlin VerticalAnchor.aboveBottom(0)`.

=== "Json"

    ```json title="Example"
    {
      "above_bottom": 5
    }
    ```

### `below_top`

Returns a y-value below the max build height of the world by `below_top` blocks.

=== "Kotlin"

    ```kotlin title="Example"
    VerticalAnchor.belowTop(5)
    ```

    !!! tip
    
        If you want to get the maximum build height, you can also use `#!kotlin VerticalAnchor.top()` or
        `#!kotlin VerticalAnchor.TOP` instead of `#!kotlin VerticalAnchor.belowTop(0)`.

=== "Json"

    ```json title="Example"
    {
      "below_top": 5
    }
    ```

## Vanilla Height Providers

### `minecraft:constant`

Always returns the y-value provided by a vertical anchor.

`value`

:   The vertical anchor to use.

=== "Kotlin"

    ```kotlin title="Example"
    ConstantHeight.of(VerticalAnchor.absolute(10))
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:constant",
      "value": {
        "absolute": 10
      }
    }
    ```

    !!! tip
    
        Mojang also added a feature that allows directly specifying a vertical anchor when a height provider is expected. So
        this is would also be a valid height provider:
    
        ```json
        {
          "absolute": 10
        }
        ```
    
        Or even directly providing a constant value:
    
        ```json
        10
        ```

### `minecraft:uniform`

Generates a random y-value between `min_inclusive` and `max_inclusive` in a uniform distribution.

`min_inclusive`

:   A vertical anchor that specifies the minimum y-value.

`max_inclusive`

:   A vertical anchor that specifies the maximum y-value.

=== "Kotlin"

    ```kotlin title="Example"
    UniformHeight.of(VerticalAnchor.bottom(), VerticalAnchor.absolute(256))
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:uniform",
      "min_inclusive": {
        "above_bottom": 0
      },
      "max_inclusive": {
        "absolute": 256
      }
    }
    ```

### `minecraft:biased_to_bottom`/`minecraft:very_biased_to_bottom`

Generates a random y-value between `min_inclusive` and `max_inclusive` with bias towards the minimum.

`min_inclusive`

:   A vertical anchor that specifies the minimum y-value.

`max_inclusive`

:   A vertical anchor that specifies the maximum y-value.

`inner` (Optional in Json)

:   The higher this value is, the more biased the distribution is towards the minimum. Defaults to `0`.

=== "Kotlin"

    ```kotlin
    VeryBiasedToBottomHeight.of(VerticalAnchor.bottom(), VerticalAnchor.belowTop(8), 8)
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:very_biased_to_bottom",
      "min_inclusive": {
        "above_bottom": 0
      },
      "max_inclusive": {
        "below_top": 8
      },
      "inner": 8
    }
    ```

### `minecraft:trapezoid`

Generates a random y-value between `min_inclusive` and `max_inclusive` with a [trapezoidal distribution](https://en.wikipedia.org/wiki/Trapezoidal_distribution).

The Minecraft Wiki explains its usage in ore generation pretty well:

![Trapezoidal distribution](https://i.imgur.com/K7NO5jj.png)

`min_inclusive`

:   A vertical anchor that specifies the minimum y-value.

`max_inclusive`

:   A vertical anchor that specifies the maximum y-value.

`plateau` (optional)

:   The length of the range in the middle of the trapezoid that has a uniform distribution. Defaults to `0`.

=== "Kotlin"

    ```kotlin title="Example"
    TrapezoidHeight.of(VerticalAnchor.absolute(8), VerticalAnchor.absolute(24))
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:trapezoid",
      "min_inclusive": {
        "absolute": 8
      },
      "max_inclusive": {
        "absolute": 24
      }
    }
    ```

### `minecraft:weighted_list`

Generates a random y-value based on a weighted list of other height providers.

`distribution`

:   A list of height providers and their weights (Can't be empty). `data` is the actual height provider and `weight` is the weight of the provider.

=== "Kotlin"

    ```kotlin title="Example"
    WeightedListHeight(
        SimpleWeightedRandomList.builder<HeightProvider>()
            .add(UniformHeight.of(VerticalAnchor.absolute(0), VerticalAnchor.absolute(8)), 2)
            .add(ConstantHeight.of(VerticalAnchor.absolute(0)), 1)
            .build()
    )
    ```

=== "Json"

    ```json title="Example"
    {
      "type": "minecraft:weighted_list",
      "distribution": [
        {
          "data": {
            "type": "minecraft:uniform",
            "value": {
              "min_inclusive": 0,
              "max_inclusive": 4
            }
          },
          "weight": 2
        },
        {
          "data": 0,
          "weight": 1
        }
      ]
    }                
    ```

## Inline `VerticalAnchors`

If none of the vanilla `VerticalAnchors` fit your needs, you can also inline your own `VerticalAnchor` via lambdas:

```kotlin title="Example"
ConstantHeight.of { ctx -> ctx.genDepth % ctx.minGenY }
```