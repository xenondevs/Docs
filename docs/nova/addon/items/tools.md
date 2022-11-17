!!! info "Creating custom tools"

    If you're looking to create custom tools, check out the [`Tool` item behavior](item-behaviors.md).

## Tool Levels

Tool Levels represent the tier of a tool. Internally, those tiers are represented by numbers. By default, there are three levels:

| Tool Type | Level |  ToolLevel (Nova)   |
|:----------|:-----:|:-------------------:|
| Wooden    |   0   |       `null`        |
| Gold      |   0   |       `null`        |
| Stone     |   1   |  `ToolLevel.STONE`  |
| Iron      |   2   |  `ToolLevel.IRON`   |
| Diamond   |   3   | `ToolLevel.DIAMOND` |
| Netherite |   3   | `ToolLevel.DIAMOND` |

??? question "Why is there no `ToolLevel.WOODEN`?"

    Since the wooden tool tier is the lowest possible tier, it does not have a custom `ToolLevel` and is represented by `null`.  
    This is handled this way to prevent confusion when dealing with tool categories that do not have multiple tool levels
    (e.g. shears) which would then also be categorized under the wooden tool tier.

    It is still possible to require a wooden tool to break a block by setting the the desired `ToolCategory`,
    `null` as the `ToolLevel` and `requiresToolForDrops = true` in `BlockOptions`.

    Wooden and golden tools can break the same blocks, which is why they're both on ToolLevel `0` / `null`.

The numerical values are assigned to the tool levels in the `tool_levels.yml` config file:

```yaml title="tool_levels.yml"
stone: 1
iron: 2
diamond: 3
```

### Registering a custom tool level

To register a new tool level, simply call `ToolLevelRegistry#register`.  
As always, we recommend storing your tool levels as final values in a singleton object:

```kotlin
object ToolLevels {
    
    val EXAMPLE_LEVEL = ToolLevelRegistry.register(ExampleAddon, "example_level")
    
}
```

Then, assign a numerical tool level value to your registered value in the `tool_levels.yml` config file:

```yaml title="tool_levels.yml"
example_level: 4
```

The specified level of `4` would give tools of that level the ability to break all blocks that `diamond` or `netherite`
tools could break + additional custom blocks that have a tool level with the numerical value of `4` configured in their
`BlockOptions`.

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

The `getIcon` lambda is required for WAILA to display the proper tool icon. You're given a tool level and need to return
the texture path to the tool icon.

You can then use your new tool category in the `BlockOptions` of your custom block to make those blocks only breakable
with a tool of that category.