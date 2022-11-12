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
pretty much the same thing as `Predicate<BlockState>` in Java. The following `RuleTest`s are available:

<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Example</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            `minecraft:always_true`
        </td>
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
        <td>`minecraft:block_match`</td>
        <td>Matches a specific block</td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:block_match",
              "block": "minecraft:stone" // (1)!
            }
            ```
            
            1. Also supports Nova blocks
        </td>
    </tr>
    <tr>
        <td>`minecraft:blockstate_match`</td>
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
        <td>`minecraft:tag_match`</td>
        <td>Matches a specific [block tag](https://minecraft.fandom.com/wiki/Tag#Blocks)</td>
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
        <td>`minecraft:random_block_match`</td>
        <td>Matches the given block with a probability. The probability should be a value in the range $[0;1]$.</td>
        <td>
            ```json
            "target": {
              "predicate_type": "minecraft:random_block_match",
              "block": "minecraft:cobblestone",
              "probability": 0.5 // (1)!
            }
            ```
            
            1. $50%$ chance to match
        </td>
    </tr>
    </tbody>
</table>