# Fill layer feature

The `fill_layer` feature can be used to fill an entire 16x16 chunk area with a single block.

## Configuration

The following configuration options are available:


| Option   | Type                                   | Description                                                         |
|----------|----------------------------------------|---------------------------------------------------------------------|
| `state`  | A [`BlockState`](../../block-state.md) | The block state to use for the layer.                               |
| `height` | An `int` in the range $[0;4064 ]$.     | The height of the layer to fill (starting at the min build height). |

## Example

As an example, here's a configured- and placed feature to add a layer of grass on top of a default flat world.

```json title="configured_feature/fill_layer_grass.json"
{
  "height": 4,
  "state": {
    "Name": "minecraft:grass"
  }
}
```

```json title="placed_feature/fill_layer_grass.json"
{
  "feature": "minecraft:fill_layer_grass",
  "placement": []
}
```