# Ore features

Ore features are used to generate ores in the world. They are configured using the `ore` or `scattered_ore` feature types
(`ore` is recommended for most cases).

## Configuration

The following options are available for ore configurations:

| Option                           | Description                                                                                                                                                        |
|----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `size`                           | An `int` in the range $[0;64]$. Determines the volume size of the ore.                                                                                             |
| `discard_chance_on_air_exposure` | A `float` in the range $[0;1]$. Determines the chance that the ore will be discarded if it is exposed to air. `1` means that the ore will never be exposed to air. |
| `targets`                        | A list which determines what block to use for specific targets. Needs a `target` and a `state` option. See below for more details.                                 |

### Targets

As mentioned above, the `targets` option is a list of targets. The `target` option is a so called`RuleTest`. A `RuleTest` is 
pretty much the same thing as `Predicate<BlockState>` in Java.  
The following `RuleTest`s are available:

<table>
    <thead>
    <tr>
        <th style="width: 30%">Name</th>
        <th style="width: 30%">Description</th>
        <th style="width: 40%">Example</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>minecraft:always_true</code></td>
        <td>Matches every block</td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:always_true"
            }
            ```
        </td>
    </tr>
    <tr>
        <td><code>minecraft:block_match</code></td>
        <td>Matches a specific block</td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:block_match",
              "block": "minecraft:stone"
            }
            ```
            
            <code>block</code> also supports Nova blocks.
        </td>
    </tr>
    <tr>
        <td><code>minecraft:blockstate_match</code></td>
        <td>Matches a specific blockstate</td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:blockstate_match",
              "block_state": {
                "Name": "minecraft:glass_pane",
                "Properties": {
                  "east": "true",
                  "north": "false",
                  "south": "false",
                  "waterlogged": "false",
                  "west": "true"
                }
              }
            }
            ```
    </tr>
    <tr>
        <td><code>minecraft:tag_match</code></td>
        <td>Matches a specific <a href="https://minecraft.fandom.com/wiki/Tag#Blocks">block tag</a></td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:tag_match",
              "tag": "minecraft:stone_ore_replaceables"
            }
            ```
        </td>
    </tr>
    <tr>
        <td><code>minecraft:random_block_match</code></td>
        <td>Matches the given block with a probability. The probability should be a value between 0.0 and 1.0.</td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:random_block_match",
              "block": "minecraft:cobblestone",
              "probability": 0.5
            }
            ```
        </td>
    </tr>
    <tr>
        <td><code>minecraft:random_blockstate_match</code></td>
        <td>Matches the given blockstate with a probability. The probability should be a value between 0.0 and 1.0.</td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:random_blockstate_match",
              "block_state": {
                "Name": "minecraft:glass_pane",
                "Properties": {
                  "east": "true",
                  "north": "false",
                  "south": "false",
                  "waterlogged": "false",
                  "west": "true"
                }
              }
              "probability": 0.5
            }
            ```
        </td>
    </tbody>
</table>

## Example

As an example, here's the configured- and placed feature of star shards ore from the machines addon.

```json title="configured_feature/ore_star_shards.json"
{
  "type": "minecraft:ore",
  "config": {
    "discard_chance_on_air_exposure": 0.0,
    "size": 4,
    "targets": [ // (1)!
      {
        "state": {
          "Name": "machines:star_shards_ore"
        },
        "target": {
          "predicate_type": "minecraft:tag_match",
          "tag": "minecraft:stone_ore_replaceables"
        }
      },
      {
        "state": {
          "Name": "machines:deepslate_star_shards_ore"
        },
        "target": {
          "predicate_type": "minecraft:tag_match",
          "tag": "minecraft:deepslate_ore_replaceables"
        }
      }
    ]
  }
```

1. Specify that `star_shards_ore` should be used to replace normal stone and `deepslate_star_shards_ore` should be used to replace deepslate.

```json title="placed_feature/ore_star_shards.json"
{
  "feature": "machines:ore_star_shards",
  "placement": [
    {
      "type": "minecraft:count",
      "count": 30 // (1)!
    },
    {
      "type": "minecraft:in_square" // (2)!
    },
    {
      "type": "minecraft:height_range", // (3)!
      "height": {
        "type": "minecraft:uniform",
        "max_inclusive": {
          "below_top": 0
        },
        "min_inclusive": {
          "absolute": 120
        }
      }
    },
    {
      "type": "minecraft:biome" // (4)!
    }
  ]
}
```

1. 30 tries per chunk
2. Spread the tries in a square
3. Place the ore above y-level 119
4. Discard the try if we moved into a biome that doesn't generate star shards