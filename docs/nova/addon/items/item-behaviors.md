# Item Behaviors

Item behaviors are used to add functionality to items. There are some default implementations, but you can also create your own.

## Default Item Behaviors

???+ example "Default Item Behaviors"

    These are the default item behaviors that Nova provides:

    === "Chargeable"
    
        Allows you to make an item that stores energy. This should mostly be used with other custom item behaviors, since
        there is no default implementation for consuming energy.
    
        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Chargeable)
        ```
        
        The above example uses the durability bar to display the item's charge. If you don't want this, you can disable this behavior:
        
        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Chargeable(false))
        ```

        The energy capacity can then be configured in the material config file:
        
        ```yaml title="configs/example_item.yml"
        max_energy: 100000
        ```

    === "Consumable"

        Allows you to make a custom consumable item. Example:

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Consumable)
        ```

        ```yaml title="configs/example_item.yml"
        # The type of food (normal, fast, always_eatable).
        food_type: normal
        # The time it takes for the food to be consumed, in ticks.
        consume_time: 40
        # The nutrition value this food provides.
        nutrition: 4
        # The saturation modifier this food provides.
        saturation_modifier: 0.3
        # The amount of health to be restored immediately.
        instant_health: 5
        # A list of effects to apply to the player when this food is consumed.
        effects: []
        ```

        ??? info "Saturation & Nutrition"

            This is how the `saturation_modifier` and `nutrition` value affect your player's food level and saturation:
            ```kotlin title="foodLevel"
            min(player.foodLevel + options.nutrition, 20)
            ```
            ```kotlin title="saturation"
            min(saturation + nutrition * saturationModifier * 2.0f, foodLevel)
            ```

            !!! info

                You can find the `nutrition` and `saturationModifier` for vanilla Minecraft items by decompiling the mojang-mapped
                class `net.minecraft.world.food.Foods`.

        ??? example "Example Effect"

            ```yaml
            effects:
            # A level 1 speed effect that lasts 10 seconds.
            - type: speed # (1)!
              duration: 200 # (2)!
              amplifier: 0 # (3)!
              ambient: true # (4)!
              particles: true # (5)!
              icon: true # (6)!
            ```

            1. The type of the effect.  
               A list of all effect types can be found [here](https://minecraft.fandom.com/wiki/Effect#Effect_list).
            2. The duration of the effect in ticks.
            3. The amplifier of the effect. An amplifier of 0 is a level 1 effect.
            4. Whether the effect is ambient or not.  
               Default value: `true`
            5. Whether the effect has particles or not.  
               Default value: `true`
            6. Whether the effect has an icon or not.  
               Default value: `true`
               

    === "Wearable"

        Allows you to make an item that can be equipped in a players armor slots.
        
        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Wearable)
        ```

        ```yaml title="configs/example_item.yml"
        armor_type: CHESTPLATE
        armor: 8.0
        armor_toughness: 3.0
        knockback_resistance: 2.0
        ```

        If you don't want to make the armor type configurable:

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Wearable(ArmorType.CHESTPLATE))
        ```

        ```yaml title="configs/example_item.yml"
        armor: 8.0
        armor_toughness: 3.0
        knockback_resistance: 2.0
        ```

        If you need some examples for the `armor`, `armorToughness` and `knockback_resistance` values,
        you can check out the [Minecraft wiki](https://minecraft.fandom.com/wiki/Armor#Defense_points).

    === "Tool"
    
        Allows you to create a custom tool.

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Tool)
        ```

        ```yaml title="configs/example_item.yml"
        # The tool level
        tool_level: minecraft:iron
        # The tool category
        tool_category: minecraft:sword
        # The block breaking speed
        break_speed: 1.5
        # The attack damage
        attack_damage: 6
        # The attack speed
        attack_speed: 2.0
        # The knockback bonus
        knockback_bonus: 1
        # If sweep attacks can be performed with this tool
        can_sweep_attack: true
        # If this tool can break blocks in creative
        can_break_blocks_in_creative: false
        ```

    === "Damageable"

        Makes an item damageable.

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Damageable)
        ```

        ```yaml title="configs/example_item.yml"
        # The maximum durability of the item.
        max_durability: 200
        # The damage the item takes when it is used to attack an entity.
        item_damage_on_attack_entity: 1
        # The damage the item takes when it is used to break a block.
        item_damage_on_break_block: 2
        # The repair ingredient that can be used in anvils.
        repair_ingredient: "minecraft:paper"
        ```

    === "Enchantable"

        Makes your item enchantable.

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Enchantable)
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
           Available enchantment categories: `armor`, `armor_feet`, `armor_legs`, `armor_chest`, `armor_head`, `weapon`,
           `digger`, `fishing_rod`, `trident`, `breakable`, `bow`, `wearable`, `crossbow`, `vanishable`

    === "Stripping"

        Gives your item the ability to strip wood, logs, oxidization layers and wax.

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Stripping)
        ```

    === "Flattening"

        Gives your item the ability to create dirt paths.

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Flattening)
        ```

    === "Extinguishing"

        Gives your item the ability to extinguish campfires.

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Extinguishing)
        ```

    === "Tilling"

        Gives your item the ability to till dirt.

        ```kotlin
        val EXAMPLE_ITEM = registerDefaultItem(ExampleAddon, "example_item", Tilling)
        ```

??? abstract "Using hardcoded material options (not recommended)"

    If you don't want your material options to be configurable or your specific use-case does not work well with
    configurable values, you can using the factory functions named after the material options interfaces.  
    For example, this is how you would create hardcoded `ToolOptions`:
    
    ```kotlin title="Hardcoded ToolOptions"
    @OptIn(HardcodedMaterialOptions::class)
    val toolOptions = ToolOptions(
        ToolLevel.STONE,
        ToolCategory.PICKAXE,
        breakSpeed = 12.0,
        attackDamage = 4.0,
        attackSpeed = 1.0,
        canSweepAttack = false,
        canBreakBlocksInCreative = false
    )
    ```
    
    Since hardcoding those values is strongly discouraged, you need to opt-in via the `@OptIn(HardcodedMaterialOptions::class)` annotation.


## Custom Item Behaviors

There are of course a lot of cases that don't fit into any of the default item behaviors which is why you can easily make
your own. Just create a new class and extend ``ItemBehavior``. Here you can override a lot of methods, they should all be
pretty self-explanatory. Here's an example of a custom item behavior we use for our [Jetpacks](https://www.spigotmc.org/resources/nova-addon-jetpacks.102714/) addon:

```kotlin
class JetpackBehavior(
    private val tier: JetpackTier
) : ItemBehavior() {
    
    override fun handleEquip(player: Player, itemStack: ItemStack, equipped: Boolean, event: ArmorEquipEvent) {
        if (event.equipMethod == EquipMethod.BREAK) {
            event.isCancelled = true
        } else setJetpack(player, equipped)
    }
    
    private fun setJetpack(player: Player, state: Boolean) {
        if (state) {
            AttachmentManager.addAttachment(player, tier.attachmentType)
            AbilityManager.giveAbility(player, tier.abilityType)
        } else {
            AttachmentManager.removeAttachment(player, tier.attachmentType)
            AbilityManager.takeAbility(player, tier.abilityType)
        }
    }
    
}
```

!!! bug "Modifying item display name, lore and other attributes"

    Make sure to not update an items lore or display name in the ``modifyItemBuilder`` method,
    always use the ``updatePacketItemData`` methods.
    
    Confused? Take a look at [Understanding Packet Items](using-item-nova-material.md#understanding-packet-items).

### ItemBehaviorFactory & MaterialOptions

If you want to create item behaviors that can be added with a similar syntax as the default item behaviors, you'll need
to inherit from `ItemBehaviorFactory` in the companion object of your `ItemBehavior`. Then, implement the `create(ItemNovaMaterial)`
function. Here, you can create an instance of your `ItemBehavior` based on the `ItemNovaMaterial` that is passed to the function.

With `MaterialOptions` and `ConfigAccess`, you easily create config-reloadable properties for your item behavior.
Here is an example of how we implement
[ItemBehaviorFactory](https://github.com/xenondevs/Nova/blob/main/nova/src/main/kotlin/xyz/xenondevs/nova/item/behavior/Consumable.kt#L151-L154) and
[MaterialOptions / ConfigAccess](https://github.com/xenondevs/Nova/blob/main/nova/src/main/kotlin/xyz/xenondevs/nova/material/options/FoodOptions.kt)
for food items.

## Item Data

If you need to store or retrieve data from an `ItemStack`, call `ItemStack.novaCompound` to retrieve the CBF Compound.
There, you can store any data you want.

!!! tip

    Make sure to check out the CBF documentation for more information.  
    [:material-file-document-outline: CBF Documentation](../../../../../cbf/){ .md-button }