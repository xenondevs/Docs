---
icon: lucide/sparkles
---

# Enchantments

## Enchantable Items

To make an `#!kotlin ItemType` enchantable, add the `#!kotlin Enchantable` behavior:

=== "Kotlin"

    ```kotlin
    val EXAMPLE_ITEM = registerItem(
        "example_item",
        Enchantable(
            enchantmentValue = 10,
            supportedEnchantments = registryEntrySetOf(
                EnchantmentEntries.SHARPNESS,
                EnchantmentEntries.SMITE,
                EnchantmentEntries.BANE_OF_ARTHROPODS,
                EnchantmentEntries.KNOCKBACK,
                EnchantmentEntries.FIRE_ASPECT,
                EnchantmentEntries.LOOTING,
                EnchantmentEntries.SWEEPING_EDGE,
                EnchantmentEntries.UNBREAKING,
                EnchantmentEntries.MENDING
            )
        )
    )
    ```

=== "Kotlin + YAML"

    ```kotlin
    val EXAMPLE_ITEM = registerItem("example_item", Enchantable())
    ```

    ```yaml title="configs/example_item.yml"
    enchantment_value: 10 # (1)!
    supported_enchantments: # (2)!
       - minecraft:sharpness
       - minecraft:smite
       - minecraft:bane_of_arthropods
       - minecraft:knockback
       - minecraft:fire_aspect
       - minecraft:looting
       - minecraft:sweeping_edge
       - minecraft:unbreaking
       - minecraft:mending
    ```

    1. The enchantment value of the item. This value defines how enchantable an item is. A higher enchantment value means more secondary and higher-level enchantments.  
       Vanilla enchantment values: wood: `15`, stone: `5`, iron: `14`, diamond: `10`, gold: `22`, netherite: `15`
    2. The supported enchantments of this item. Since `primary_enchantments` is not defined, these are also the primary enchantments of the item.

!!! abstract "`supported_enchantments` vs. `primary_enchantments`"

      Supported enchantments: The enchantments that can be applied to the item, i.e. via anvil or commands.  
      Primary enchantments: The enchantments that appear in the enchanting table.

      `primary_enchantments` defaults to `supported_enchantments`. Once you add `primary_enchantments` to the config, list only the supported enchantments that should appear in the enchanting table.

Instead of adding the primary/supported enchantments to the item, you can also add the primary/supported items to an enchantment:

```kotlin
ExampleAddon.itemTag(ItemTypeTags.ENCHANTABLE_SHARP_WEAPON) { // (1)!
    add(EXAMPLE_ITEM)
}
```

1. Edits the existing `#minecraft:enchantable/sharp_weapon"` to include our `EXAMPLE_ITEM`. This tag is in turn used by for the primary/supported items of weapon-related enchantments like `minecraft:sharpness`.


### Custom Enchantments

You can register a custom enchantment like this:

```kotlin title="Enchantments.kt"
@Init(stage = InitStage.PRE_PACK) // (1)!
object Enchantments {
    
    val EXAMPLE_ENCHANTMENT = ExampleAddon.enchantment("example_enchantment") {
        enchantsPrimary(ItemTypeTags.ENCHANTABLE_MELEE_WEAPON) // (2)!
        enchants(ItemTypeTags.ENCHANTABLE_SHARP_WEAPON) // (3)!
        
        tableDiscoverable(true)
        // ... (4)
    }
   
}
```

1. Nova will load this class during addon initialization, causing your enchantments to be registered
2. The primary items (those items that will see this enchantment in the enchanting table) are swords and spears.
3. The supported enchantments are all melee weapons. This enchantment can also be applied to axes via an anvil, but it will never show up in the enchanting table for axes. 
4. Refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.registry/-enchantment-builder/index.html) for list of available functions and properties.
