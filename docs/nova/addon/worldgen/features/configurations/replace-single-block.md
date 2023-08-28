# Replace single block feature

The `replace_single_block` feature allows you to randomly replace blocks with another block.

## Configuration

The `replace_single_block` feature has a single option, `targets` which similar to the `targets` option in the [ore feature](ores.md),
allows you to specify which block states should be replaced with which other block states. Each `Target` has the following options:

| Option   | Type                                                                             | Description                                        |
|----------|----------------------------------------------------------------------------------|----------------------------------------------------|
| `target` | A `RuleTest`. Check out the [`ores`](ores.md#targets) page for more information. | The test to check if the block should be replaced. |
| `state`  | A [`BlockState`](../../types/block-state.md)                                     | The block state to replace the target with.        |

In code, the `ReplaceBlockConfiguration` class is used to configure the feature.

## Example

As an example, here's a feature to randomly replace acacia logs with stone.

=== "Kotlin"

    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val ACACIA_LOGS_TO_STONE = registerConfiguredFeature(
            "acacia_logs_to_stone",
            Feature.REPLACE_SINGLE_BLOCK,
            ReplaceBlockConfiguration(
                listOf(
                    OreConfiguration.target(TagMatchTest(BlockTags.ACACIA_LOGS), Blocks.STONE.defaultBlockState())
                )
            )
        )
    
    }
    ```

    Or, if you only want to replace one specific block state
    
    ```kotlin title="ConfiguredFeatures.kt"
    @OptIn(ExperimentalWorldGen::class)
    @Init(stage = InitStage.POST_PACK_PRE_WORLD)
    object ConfiguredFeatures : FeatureRegistry by ExampleAddon.registry {
    
        val ACACIA_LOGS_TO_STONE = registerConfiguredFeature(
            "acacia_logs_to_stone",
            Feature.REPLACE_SINGLE_BLOCK,
            ReplaceBlockConfiguration(
                Blocks.ACACIA_LOG.defaultBlockState(),
                Blocks.STONE.defaultBlockState(),
            )
        )
    
    }
    ```

=== "Json"

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
