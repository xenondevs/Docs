# Height Providers

Height providers are used to get a height value for a given position. Before we can get into the details however, we first
need to take a look at `VerticalAnchors`.

## Vertical Anchors

Vertical anchors are used to get a fixed height value depending on factors like the min build height or the max build height.
There is of course also a constant implementation that always returns the same value. Please note that the type doesn't 
have to be specified here. It's automatically inferred via the key name.

### `absolute`

Always returns the same y-value.

```json title="Example"
{
  "absolute": 10
}
```

### `above_bottom`

Returns a y-value above the min build height of the world by `above_bottom` blocks.

```json title="Example"
{
  "above_bottom": 5
}
```

### `below_top`

Returns a y-value below the max build height of the world by `below_top` blocks.

```json title="Example"
{
  "below_top": 5
}
```

!!! warning

    All specified values need to be within the the min and max build height of the world.

## Vanilla Height Providers

### `minecraft:constant`

Always returns the y-value provided by a vertical anchor.

`value`

:   The vertical anchor to use.

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

### `minecraft:uniform`

Generates a random y-value between `min_inclusive` and `max_inclusive` in a uniform distribution.

`min_inclusive`

:   A vertical anchor that specifies the minimum y-value.

`max_inclusive`

:   A vertical anchor that specifies the maximum y-value.

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

`inner` (optional)

:   The higher this value is, the more biased the distribution is towards the minimum. Defaults to `0`.

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

```json title="Example"
{
  "type": "minecraft:trapezoid",
  "max_inclusive": {
    "absolute": 24
  },
  "min_inclusive": {
    "absolute": 8
  }
}
```

### `minecraft:weighted_list`

Generates a random y-value based on a weighted list of other height providers.

`distribution`

:   A list of height providers and their weights (Can't be empty). `data` is the actual height provider and `weight` is the weight of the provider.

```json title="Example"
{
  "type": "minecraft:weighted_list",
  "distribution": [
    {
      "data": {
        "type": "minecraft:uniform",
        "value": {
          "max_inclusive": 4,
          "min_inclusive": 0
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