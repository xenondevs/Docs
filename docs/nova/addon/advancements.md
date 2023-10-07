# Advancements

!!! warning "Advancement DSL builder has been removed"

    The built-in advancement DSL builder has been removed in 0.15.  
    However, you can still create advancements using Mojang's internal advancement builders and then register them using
    `AdvancementLoader` like before.
    
    Alternatively, you could also use a third-party advancement api.

Advancements can be created with the top level function `advancement`.  
From there, you'll need to use Mojang's internal advancement builders.

## Creating the root advancement

When creating the root advancement, make sure to set a background image and a criterion that is obtained automatically,
such as an empty tick.

```kotlin title="Example root advancement"
private val ROOT = advancement(ExampleAddon, "root") {
    display(DisplayInfo(
        Items.MY_ITEM.clientsideProvider.get().nmsCopy,
        Component.translatable("advancement.example_addon.root.title").toNMSComponent(),
        Component.empty().toNMSComponent(),
        ResourceLocation("minecraft", "textures/block/tuff.png"),
        FrameType.TASK,
        false, false, false
    ))
    
    addCriterion("tick", PlayerTrigger.TriggerInstance.tick())
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

## Registering Advancements

After creating all advancements, you can register them using the `AdvancementLoader`:

```kotlin
AdvancementLoader.registerAdvancements(ROOT, DUST, ALL_DUSTS)
```