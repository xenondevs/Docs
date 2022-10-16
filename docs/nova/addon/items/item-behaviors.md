# Item Behaviors

Item behaviors are used to add functionality to items. There are some default implementations, but you can also create your own.

As stated in the previous section, for consumable items you can either call ``NovaMaterial#registerFood`` or call
``NovaMaterial#registerItem`` with the ``Consumable`` item behavior. This item behavior lets you specify the food options
like the consumeTime, the nutrition and much more. However, there are more item behaviors that you can use for different
purposes.

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
        enchantment_value: 
        # The enchantment categories
        enchantment_categories: ["weapon", "breakable"]
        ```

        ??? example "Available enchantment categories"

            `armor`, `armor_feet`, `armor_legs`, `armor_chest`, `armor_head`, `weapon`, `digger`, `fishing_rod`, `trident`,
            `breakable`, `bow`, `wearable`, `crossbow`, `vanishable`

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

## Item data

If you need to store or retrieve data, use the ``ItemStack.storeData``, ``ItemStack.retrieveData`` and ``ItemStack.retrieveDataOrNull`` 
functions.