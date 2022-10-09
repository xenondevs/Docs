# Advancements

Advancements can be created with the top level function `advancement`.  
After creating all advancements, you can register them using `AdvancementManager#registerAdvancements`

!!! important

    Before continuing, make sure to be familiar with
    [Minecraft's advancement format](https://minecraft.fandom.com/wiki/Advancement/JSON_format) which is used in datapacks,
    as Nova's way of registering advancements is basically just a kotlin DSL builder for that.

## Creating the root advancement

When creating the root advancement, make sure to set a background image and a criterion that is obtained automatically,
such as an empty tick.

??? example "Example root advancement"

    ```kotlin
    private val ROOT = advancement(ExampleAddon, "root") {
        display {
            icon(Blocks.EXAMPLE_BLOCK)
            title(TranslatableComponent("advancement.example_addon.root.title"))
            description("")
            background("minecraft:textures/block/tuff.png")
            
            announceToChat(false)
            showToast(false)
        }
        
        criteria { tick("tick") {} }
    }
    ```

## Advancements for obtaining Nova items

Nova also provided some useful top level functions for creating advancements with Nova items:

* `obtainNovaItemAdvancement`
* `obtainNovaItemsAdvancement`

??? example "Example usage of obtainNovaItemAdvancement and obtainNovaItemsAdvancement"

    === "obtainNovaItemAdvancement"

        ```kotlin
        private val OBTAIN_EXAMPLE_ITEM = obtainNovaItemAdvancement(ExampleAddon, ROOT, Blocks.EXAMPLE_ITEM)
        ```

    === "obtainNovaItemsAdvancement"

        ```kotlin
        // Advancement for obtaining any dust type
        private val DUST = obtainNovaItemsAdvancement(ExampleAddon, "dust", ROOT, listOf(
            Items.IRON_DUST, Items.GOLD_DUST, Items.DIAMOND_DUST,
            Items.NETHERITE_DUST, Items.EMERALD_DUST, Items.LAPIS_DUST,
            Items.COAL_DUST, Items.COPPER_DUST, Items.STAR_DUST
        ), false)
        
        // Advancement for obtaining all dust types
        private val ALL_DUSTS = obtainNovaItemsAdvancement(ExampleAddon, "all_dusts", DUST, listOf(
            Items.DIAMOND_DUST, Items.IRON_DUST, Items.GOLD_DUST,
            Items.NETHERITE_DUST, Items.EMERALD_DUST, Items.LAPIS_DUST,
            Items.COAL_DUST, Items.COPPER_DUST, Items.STAR_DUST
        ), true)
        ```