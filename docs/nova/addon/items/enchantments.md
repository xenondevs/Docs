# Enchantments

## Enchantable Items

To make a `NovaItem` enchantable, add the `Enchantable` item behavior.

```kotlin
val EXAMPLE_ITEM = registerItem("example_item", Enchantable)
```

```yaml title="configs/example_item.yml"
# The enchantment value
enchantment_value: 10 # (1)!
# The enchantment categories
enchantment_categories: ["weapon", "breakable"] # (2)!
```

1. The enchantment value of the item. This value defines how enchantable an item is.
   A higher enchantment value means more secondary and higher-level enchantments.  
   Vanilla enchantment values: wood: `15`, stone: `5`, iron: `14`, diamond: `10`, gold: `22`, netherite: `15`
2. The enchantment categories of the item. This defines which enchantments can be applied to this item.

## Working with enchantable items

Utility functions to work with enchantable items can be found in the companion object of `Enchantable`.  
Those utility functions can be used for both vanilla and custom items and both vanilla and custom enchantments.

!!! info "Use Nova's `Enchantment` class"

    Since Nova provides wrappers for vanilla enchantments, you will not need to use `#!java org.bukkit.enchantment.Enchantment`
    or `#!java net.minecraft.world.item.enchantment.Enchantment` but should always use 
    `#!java xyz.xenondevs.nova.item.enchantment.Enchantment` and the utility functions from the `Enchantable` companion object.


## Enchantments

### Vanilla Enchantments

This is a list of all vanilla enchantments and which category they belong to. They can be obtained in code from `VanillaEnchantments`.

??? abstract "List of Vanilla Enchantments"

    | Name                              | In Nova                                              | Category                |
    |-----------------------------------|------------------------------------------------------|-------------------------|
    | `minecraft:protection`            | `#!kotlin VanillaEnchantments.PROTECTION`            | `minecraft:armor`       |
    | `minecraft:fire_protection`       | `#!kotlin VanillaEnchantments.FIRE_PROTECTION`       | `minecraft:armor`       |
    | `minecraft:feather_falling`       | `#!kotlin VanillaEnchantments.FEATHER_FALLING`       | `minecraft:armor`       |
    | `minecraft:blast_protection`      | `#!kotlin VanillaEnchantments.BLAST_PROTECTION`      | `minecraft:armor`       |
    | `minecraft:projectile_protection` | `#!kotlin VanillaEnchantments.PROJECTILE_PROTECTION` | `minecraft:armor`       |
    | `minecraft:respiration`           | `#!kotlin VanillaEnchantments.RESPIRATION`           | `minecraft:armor_head`  |
    | `minecraft:aqua_affinity`         | `#!kotlin VanillaEnchantments.AQUA_AFFINITY`         | `minecraft:armor_head`  |
    | `minecraft:thorns`                | `#!kotlin VanillaEnchantments.THORNS`                | `minecraft:armor_chest` |
    | `minecraft:swift_sneak`           | `#!kotlin VanillaEnchantments.SWIFT_SNEAK`           | `minecraft:armor_legs`  |
    | `minecraft:depth_strider`         | `#!kotlin VanillaEnchantments.DEPTH_STRIDER`         | `minecraft:armor_feet`  |
    | `minecraft:frost_walker`          | `#!kotlin VanillaEnchantments.FROST_WALKER`          | `minecraft:armor_feet`  |
    | `minecraft:soul_speed`            | `#!kotlin VanillaEnchantments.SOUL_SPEED`            | `minecraft:armor_feet`  |
    | `minecraft:binding_curse`         | `#!kotlin VanillaEnchantments.BINDING_CURSE`         | `minecraft:wearable`    |
    | `minecraft:sharpness`             | `#!kotlin VanillaEnchantments.SHARPNESS`             | `minecraft:weapon`      |
    | `minecraft:smite`                 | `#!kotlin VanillaEnchantments.SMITE`                 | `minecraft:weapon`      |
    | `minecraft:bane_of_arthropods`    | `#!kotlin VanillaEnchantments.BANE_OF_ARTHROPODS`    | `minecraft:weapon`      |
    | `minecraft:knockback`             | `#!kotlin VanillaEnchantments.KNOCKBACK`             | `minecraft:weapon`      |
    | `minecraft:fire_aspect`           | `#!kotlin VanillaEnchantments.FIRE_ASPECT`           | `minecraft:weapon`      |
    | `minecraft:looting`               | `#!kotlin VanillaEnchantments.LOOTING`               | `minecraft:weapon`      |
    | `minecraft:sweeping`              | `#!kotlin VanillaEnchantments.SWEEPING`              | `minecraft:weapon`      |
    | `minecraft:efficiency`            | `#!kotlin VanillaEnchantments.EFFICIENCY`            | `minecraft:digger`      |
    | `minecraft:silk_touch`            | `#!kotlin VanillaEnchantments.SILK_TOUCH`            | `minecraft:digger`      |
    | `minecraft:fortune`               | `#!kotlin VanillaEnchantments.FORTUNE`               | `minecraft:digger`      |
    | `minecraft:power`                 | `#!kotlin VanillaEnchantments.POWER`                 | `minecraft:bow`         |
    | `minecraft:punch`                 | `#!kotlin VanillaEnchantments.PUNCH`                 | `minecraft:bow`         |
    | `minecraft:flame`                 | `#!kotlin VanillaEnchantments.FLAME`                 | `minecraft:bow`         |
    | `minecraft:infinity`              | `#!kotlin VanillaEnchantments.INFINITY`              | `minecraft:bow`         |
    | `minecraft:multishot`             | `#!kotlin VanillaEnchantments.MULTISHOT`             | `minecraft:crossbow`    |
    | `minecraft:quick_charge`          | `#!kotlin VanillaEnchantments.QUICK_CHARGE`          | `minecraft:crossbow`    |
    | `minecraft:piercing`              | `#!kotlin VanillaEnchantments.PIERCING`              | `minecraft:crossbow`    |
    | `minecraft:unbreaking`            | `#!kotlin VanillaEnchantments.UNBREAKING`            | `minecraft:breakable`   |
    | `minecraft:mending`               | `#!kotlin VanillaEnchantments.MENDING`               | `minecraft:breakable`   |
    | `minecraft:luck_of_the_sea`       | `#!kotlin VanillaEnchantments.LUCK_OF_THE_SEA`       | `minecraft:fishing_rod` |
    | `minecraft:lure`                  | `#!kotlin VanillaEnchantments.LURE`                  | `minecraft:fishing_rod` |
    | `minecraft:loyalty`               | `#!kotlin VanillaEnchantments.LOYALTY`               | `minecraft:trident`     |
    | `minecraft:impaling`              | `#!kotlin VanillaEnchantments.IMPALING`              | `minecraft:trident`     |
    | `minecraft:riptide`               | `#!kotlin VanillaEnchantments.RIPTIDE`               | `minecraft:trident`     |
    | `minecraft:channeling`            | `#!kotlin VanillaEnchantments.CHANNELING`            | `minecraft:trident`     |
    | `minecraft:vanishing_curse`       | `#!kotlin VanillaEnchantments.VANISHING_CURSE`       | `minecraft:vanishing`   |


### Custom Enchantments

To create a custom enchantment, you'll need to create an `EnchantmentRegistry`:

```kotlin title="Enchantments.kt"
@Init(stage = InitStage.PRE_PACK) // (1)!
object Enchantments : EnchantmentRegistry by ExampleAddon.registry {
    
    val EXAMPLE_ENCHANTMENT = enchantment("curse_of_gigantism")
        .categories(/*...*/) // (2)!
        .maxLevel(/*...*/) // (3)!
        .tableDiscoverable(/*...*/) // (4)!
        .tableLevelRequirement(/*...*/) // (5)!
        .rarity(/*...*/) // (6)!
        .curse(/*...*/) // (7)!
        .incompatibleWith(/*...*/) // (8)!
      
        // Without functionality (not yet implemented):
        .treasure(/*...*/) // (9)!
        .tradeable(/*...*/) // (10)!
       
        .register()
    
}
```

1. Nova will load this class during addon initialization, causing your enchantment categories to be registered.
2. The categories that this enchantment belongs to. Can be one or multiple. Can be custom or vanilla.
3. The maximum level of this enchantment. Defaults to `1`.
4. Whether this enchantment can be found in the enchantment table.
5. The level requirement range of this enchantment in the enchantment table.
   This defines whether an enchantment can be displayed in an enchantment table slot of a certain level.
   You either specify an `IntRange`, or a lambda that accepts the enchantment level and returns an `IntRange`.<br>
   Defaults to `#!kotlin { val min = 1 + it * 10; min..(min + 5) }` (vanilla behavior).
6. A weight value used to determine how likely this enchantment is to be found in the enchantment table.
   Common: `10`, Uncommon: `5`, Rare: `2`, Very Rare: `1`. Defaults to `10`.
7. Whether this enchantment is a curse. Defaults to `false`.
8. Enchantments that this enchantment is incompatible with. Alternatively, you can also specify a list of enchantments
   that this enchantment is compatibly with, or set a lambda that accepts an enchantment and returns whether it is compatible.
9. Whether this enchantment is a treasure enchantment. Defaults to `false`.
   **Note: There is currently no built-in way to make treasure enchantments spawn in the world**
10. Whether this enchantment is tradeable. Defaults to `false`.
    **Note: Not yet implemented**

## Enchantment Categories

Enchantment categories are groups of enchantments for certain types of items.  
In vanilla, the enchantment categories themselves define which item types they apply to, but in Nova, the item itself
chooses which enchantment categories it wants to be in via the `Enchantable` item behavior.

### Vanilla Enchantment Categories

This is a list of all vanilla enchantment categories and the enchantments they contain. They can be obtained in code
from `VanillaEnchantmentCategories` or referenced in, for example, the `enchantment_categories` config entry using their
namespaced name.

??? abstract "List of Vanilla Enchantment Categories"
    
    | Name                    | In Nova                                             | Description                                              | Enchantments                                                                                                                                                        |
    |-------------------------|:----------------------------------------------------|----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | `minecraft:armor`       | `#!kotlin VanillaEnchantmentCategories.ARMOR`       | Enchantments for all armor.                              | `minecraft:protection`, `minecraft:fire_protection`, `minecraft:blast_protection`, `minecraft:projectile_protection`                                                |
    | `minecraft:armor_feet`  | `#!kotlin VanillaEnchantmentCategories.ARMOR_FEET`  | Enchantments for boots.                                  | `minecraft:feather_falling`, `minecraft:depth_strider`, `minecraft:frost_walker`, `minecraft:soul_speed`                                                            |
    | `minecraft:armor_legs`  | `#!kotlin VanillaEnchantmentCategories.ARMOR_LEGS`  | Enchantments for leggings.                               | `minecraft:swift_sneak`                                                                                                                                             |
    | `minecraft:armor_chest` | `#!kotlin VanillaEnchantmentCategories.ARMOR_CHEST` | Enchantments for chestplates.                            | `minecraft:thorns`                                                                                                                                                  |
    | `minecraft:armor_head`  | `#!kotlin VanillaEnchantmentCategories.ARMOR_HEAD`  | Enchantments for helmets.                                | `minecraft:respiration`, `minecraft:aqua_affinity`                                                                                                                  |
    | `minecraft:weapon`      | `#!kotlin VanillaEnchantmentCategories.WEAPON`      | Enchantments for swords.                                 | `minecraft:sharpness`, `minecraft:smite`, `minecraft:bane_of_arthropods`, `minecraft:knockback`, `minecraft:fire_aspect`, `minecraft:looting`, `minecraft:sweeping` |
    | `minecraft:digger`      | `#!kotlin VanillaEnchantmentCategories.DIGGER`      | Enchantments for tools axes, hoes, pickaxes and shovels. | `minecraft:efficiency`, `minecraft:silk_touch`, `minecraft:fortune`                                                                                                 |
    | `minecraft:fishing_rod` | `#!kotlin VanillaEnchantmentCategories.FISHING_ROD` | Enchantments for the fishing rod.                        | `minecraft:luck_of_the_sea`, `minecraft:lure`                                                                                                                       |
    | `minecraft:trident`     | `#!kotlin VanillaEnchantmentCategories.TRIDENT`     | Enchantments for the trident.                            | `minecraft:loyalty`, `minecraft:impaling`, `minecraft:riptide`, `minecraft:channeling`                                                                              |
    | `minecraft:breakable`   | `#!kotlin VanillaEnchantmentCategories.BREAKABLE`   | Enchantments for items with durability.                  | `minecraft:unbreaking`, `minecraft:mending`                                                                                                                         |
    | `minecraft:BOW`         | `#!kotlin VanillaEnchantmentCategories.BOW`         | Enchantments for the bow.                                | `minecraft:power`, `minecraft:punch`, `minecraft:flame`, `minecraft:infinity`                                                                                       |
    | `minecraft:WEARABLE`    | `#!kotlin VanillaEnchantmentCategories.WEARABLE`    | Enchantments for all equipable items, including armor.   | `minecraft:binding_curse`                                                                                                                                           |
    | `minecraft:CROSSBOW`    | `#!kotlin VanillaEnchantmentCategories.CROSSBOW`    | Enchantments for the crossbow.                           | `minecraft:multishot`, `minecraft:quick_charge`, `minecraft:piercing`                                                                                               |
    | `minecraft:VANISHABLE`  | `#!kotlin VanillaEnchantmentCategories.VANISHABLE`  | Enchantments for vanishable items[^1].                   | `minecraft:vanishing_curse`                                                                                                                                         |
    
    [^1]: All items or items of blocks that implement the `Vanishable` interface, which is all tools and equipment.
          The `VANISHABLE` enchantment category also affects all items that are affected by the `BREAKABLE` category.

### Custom Enchantment Categories

Of course, you can also create your own enchantment categories.
To do this, you will need to create an `EnchantmentCategory` registry: 
```kotlin title="EnchantmentCategories.kt"
@Init(stage = InitStage.PRE_PACK) // (1)! 
object EnchantmentCategories EnchantmentCategoryRegistry by ExampleAddon.registry {
    
    val EXAMPLE_CATEGORY = registerEnchantmentCategory("example_category")
    
}
```

1. Nova will load this class during addon initialization, causing your enchantment categories to be registered.

!!! info "For flexibility reasons, enchantments add themselves to categories and not the other way around."

To apply your enchantment category to an item, you'll need to use the `Enchantable` item behavior. ([see above](#enchantable-items))
```yaml title="configs/example_item.yml"
enchantment_categories: ["example_addon:example_category"]
```

???+ info "Applying a custom category to vanilla items"

    If you want your new category to apply to vanilla items, you'll need to define that in the category itself:
    
    ```kotlin
    @Init(stage = InitStage.PRE_PACK)
    object Items EnchantmentCategoryRegistry by ExampleAddon.registry {
        
        val EXAMPLE_CATEGORY = enchantmentCategory("example_category")
            .enchants(Material.DIRT) // (1)!
            .enchants(Tag.LEAVES) // (2)!
            .register()
        
    }
    ```

    1. Makes the custom category apply to dirt.
    2. Makes the custom category apply to all leaves.