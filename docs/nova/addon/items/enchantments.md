# Enchantments

## Enchantable Items

To make a `NovaItem` enchantable, add the `Enchantable` behavior:

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
   - minecraft:sweeping
   - minecraft:unbreaking
   - minecraft:mending
```

1. The enchantment value of the item. This value defines how enchantable an item is.
   A higher enchantment value means more secondary and higher-level enchantments.  
   Vanilla enchantment values: wood: `15`, stone: `5`, iron: `14`, diamond: `10`, gold: `22`, netherite: `15`
2. The supported enchantments of this item. Since `primary_enchantments` is not defined, these are also the primary
   enchantments of the item.

!!! abstract "`supported_enchantments` vs. `primary_enchantments`"

      Supported enchantments: The enchantments that can be applied to the item, i.e. via anvil or commands.  
      Primary enchantments: The enchantments that appear in the enchanting table.

      If you're defining `supported_enchantments` via the config, `primary_enchantments` will default to `supported_enchantments`.
      Once you add `primary_enchantments` to the config, you'll need to add all enchantments from `supported_enchantments`
      to `primary_enchantments` it.

      `Enchantable` behaviors instantiated in code do not have such defaulting functionality.

### Custom Enchantments

To create a custom enchantment, you'll need to create an `EnchantmentRegistry`:

```kotlin title="Enchantments.kt"
@Init(stage = InitStage.PRE_PACK) // (1)!
object Enchantments : EnchantmentRegistry by ExampleAddon.registry {
    
    val EXAMPLE_ENCHANTMENT = enchantment("example_enchantment") {
        // ...
    }
   
}
```

!!! abstract "Refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.item.enchantment/-enchantment-builder/index.html) for list of available functions and properties."