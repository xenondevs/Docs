# Replace single block feature

The `replace_single_block` feature allows you to randomly replace blocks with another block.

## Configuration

The `replace_single_block` feature has a single option, `targets` which similar to the `targets` option in the [ore feature](ores.md),
allows you to specify which block states should be replaced with which other block states. Each `Target` has the following options:

| Option   | Type                                                                     | Description                                        |
|----------|--------------------------------------------------------------------------|----------------------------------------------------|
| `target` | A `RuleTest`. Check out the [`ores`](ores.md) page for more information. | The test to check if the block should be replaced. |
| `state`  | A [`BlockState`](../../block-state.md)                                   | The block state to replace the target with.        |

## Example

As an example, here's a feature to randomly replace acacia logs with stone.

```json title="configured_feature/acacia_logs_to_stone.json"
{
  "type": "minecraft:replace_single_block",
  "config": {
    "targets": [
      {
        "target": {
          "predicate_type": "minecraft:tag_match",
          "tag": "minecraft:acacia_logs"
        },
        "state": {
          "Name": "minecraft:stone"
        }
      }
    ]
  }
}
```
