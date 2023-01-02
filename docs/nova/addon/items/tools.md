!!! info "Creating custom tools"

    If you're looking to create custom tools, check out the [`Tool` item behavior](item-behaviors.md).

## Tool Tiers

Each tool tier maps to a numerical tool level. Those tool levels are then used to determine if a tool tier is good enough to break a block.

| Tool Type                                      | Level |   ToolTier (Nova)   |
|:-----------------------------------------------|:-----:|:-------------------:|
| No Tool                                        |   0   |       `null`        |
| ![](https://i.imgur.com/x0LolKX.png) Wooden    |   0   |   `ToolTier.WOOD`   |
| ![](https://i.imgur.com/fHQr0q6.png) Golden    |   0   |  `ToolTier.GOLDEN`  |
| ![](https://i.imgur.com/KpENSNs.png) Stone     |   1   |  `ToolLevel.STONE`  |
| ![](https://i.imgur.com/wYG64FD.png) Iron      |   2   |  `ToolLevel.IRON`   |
| ![](https://i.imgur.com/kkuGiVe.png) Diamond   |   3   | `ToolLevel.DIAMOND` |
| ![](https://i.imgur.com/jup6fy4.png) Netherite |   3   | `ToolLevel.DIAMOND` |

The numerical values are assigned to the tool levels in the `tool_levels.yml` config file:

```yaml title="tool_levels.yml"
wood: 0
gold: 0
stone: 1
iron: 2
diamond: 3
```

### Registering a custom tool tier

To register a new tool level, simply call `ToolTierRegistry#register`.  
As always, we recommend storing your tool levels as final values in a singleton object:

```kotlin
object ToolTiers {
    
    val EXAMPLE_TIER = ToolLevelRegistry.register(ExampleAddon, "example_tier")
    
}
```

Then, assign a numerical tool level value to your registered value in the `tool_levels.yml` config file:

```yaml title="tool_levels.yml"
example_tier: 4
```

The specified level of `4` would give tools of that level the ability to break all blocks that `diamond` or `netherite`
tools could break + additional custom blocks that have a tool tier that resolves to a tool level of `4`
configured in their `BlockOptions`.

## Tool Categories

Tool Categories define what type of tool your item is. They determine which blocks can be broken with which item.  
By default, there are six tool categories available:

* Sword
* Pickaxe
* Axe
* Shovel
* Hoe
* Shears

### Registering a custom tool category

To register a custom tool category, simply call `ToolCategoryRegistry#register`.  
As always, we recommend storing your tool categories as final values in a singleton object:

```kotlin
object ToolCategories {
    
    val EXAMPLE_CATEGORY = ToolCategoryRegistry.register(ExampleAddon, "example_category") {
        ResourcePath.of("example_addon", it?.let { "item/${it.id}_example" } ?: "item/example")
    }
    
}
```
!!! info

    The `getIcon` lambda is required for WAILA to display the proper tool icon. You're given a tool tier and need to return
    the texture path to the tool icon.

You can then use your new tool category in the `BlockOptions` of your custom block to make those blocks only breakable
with a tool of that category.