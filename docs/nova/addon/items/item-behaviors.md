# Item Behaviors

Item behaviors are used to add functionality to items. There are some default implementations, but you can also create your own.

## Default Item Behaviors

???+ example "Default Item Behaviors"

    These are the default item behaviors that Nova provides:

    === "Consumable"

        Allows you to make a custom consumable item. Example:

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Consumable)
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

            This is how the `saturation_modifier` and `nutrition` value affects your player's food level and saturation:
            ```kotlin title="foodLevel"
            min(player.foodLevel + options.nutrition, 20)
            ```
            ```kotlin title="saturation"
            min(saturation + nutrition * saturationModifier * 2.0f, foodLevel)
            ```

            You can find the `nutrition` and `saturationModifier` for vanilla items by decompiling the mojang-mapped
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
        val EXAMPLE_ITEM = registerItem("example_item", Wearable(ArmorType.CHESTPLATE, Sound.ITEM_ARMOR_EQUIP_DIAMOND))
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
        val EXAMPLE_ITEM = registerItem("example_item", Tool)
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
        val EXAMPLE_ITEM = registerItem("example_item", Damageable)
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
           Available enchantment categories: `armor`, `armor_feet`, `armor_legs`, `armor_chest`, `armor_head`, `weapon`,
           `digger`, `fishing_rod`, `trident`, `breakable`, `bow`, `wearable`, `crossbow`, `vanishable`

    === "Stripping"

        Gives your item the ability to strip wood, logs, oxidization layers and wax.

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Stripping)
        ```

    === "Flattening"

        Gives your item the ability to create dirt paths.

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Flattening)
        ```

    === "Extinguishing"

        Gives your item the ability to extinguish campfires.

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Extinguishing)
        ```

    === "Tilling"

        Gives your item the ability to till dirt.

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Tilling)
        ```

    === "Fuel"

        Allows your item to be used as fuel in furnaces.

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Fuel)
        ```

        ```yaml title="configs/example_item.yml"
        burn_time: 20 # (1)!
        ```
        
        1. The burn time of the item in ticks.

    === "FireResistant"

        Makes your item fire resistant.

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", FireResistant)
        ```

    === "Chargeable"
    
        Allows you to make an item that stores energy. This should mostly be used with other custom item behaviors, since
        there is no default implementation for consuming energy.
    
        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Chargeable)
        ```
        
        The above example uses the durability bar to display the item's charge. If you don't want this, you can disable this behavior:
        
        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Chargeable(false))
        ```

        The energy capacity can then be configured in the material config file:
        
        ```yaml title="configs/example_item.yml"
        max_energy: 100000
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
your own. Just create a new class and extend ``ItemBehavior``. Instead of registering event handlers, you can override
the `handle...()` functions, which are called when something is done with an `ItemStack` of a material with that behavior.

### `fun getVanillaMaterialProperties`

Gets a list of `VanillaMaterialProperty`s.  
Vanilla material properties define what properties the item should have client-side. Based on the given properties,
a corresponding vanilla material will be used. Nova will always try to find a vanilla material with the exact same
properties as requested. If there is no such material, Nova might also choose a vanilla material with more vanilla
material properties. If there is no material that has all requested properties, properties of low importance will be ignored.

These are the available vanilla material properties:

| Property Name                 | Effect                                                                   |
|-------------------------------|--------------------------------------------------------------------------|
| `DAMAGEABLE`                  | The item has a durability bar.                                           |
| `FIRE_RESISTANT`              | The item will not catch on fire.                                         |
| `CREATIVE_NON_BLOCK_BREAKING` | The item cannot break blocks in creative mode.                           |
| `CONSUMABLE_NORMAL`           | The item can be consumed normally.                                       |
| `CONSUMABLE_ALWAYS`           | The item can always be consumed.                                         |
| `CONSUMABLE_FAST`             | The item can be consumed fast, the eating process start without a delay. |
| `HELMET`                      | The item can render a custom helmet texture.                             |
| `CHESTPLATE`                  | The item can render a custom chestplate texture.                         |
| `LEGGINGS`                    | The item can render a custom leggings texture.                           |
| `BOOTS`                       | The item can render a custom boots texture.                              |

### `fun getAttributeModifiers`

Gets a list of `AttributeModifier`s.

```kotlin title="Example Attribute Modifiers"
override fun getAttributeModifiers(): List<AttributeModifier> =
    listOf(AttributeModifier(
        name = "Example Attribute Modifier (${novaMaterial.id}})", // (1)!
        attribute = Attributes.MOVEMENT_SPEED, // (2)!
        operation = Operation.MULTIPLY_TOTAL, // (3)!
        value = 0.1, // (4)!
        showInLore = true, // (5)!
        EquipmentSlot.MAINHAND // (6)!
    ))
```

1. The name of the attribute modifier. This is also used to create a `UUID` for your `AttributeModifier` to distinguish
   it from other `AttributeModifier`s. It is important that different `AttributeModifier`s have different `UUID`s.
2. The attribute that should be modified.
3. The operation that should be done.
4. The value that should be used for the operation. In this case, the movement speed will be increased by 10%.
5. Whether the attribute modifier should be shown in the `ItemStack`'s lore.
6. The equipment slot(s) that this attribute modifier should be applied to.

### `fun modifyItemBuilder`

This function is called when an `ItemBuilder` is created for an `ItemStack` of a material with this behavior.  
Here, you can add additional NBT data to the `ItemStack` by calling `ItemBuilder.addModifer`.

!!! bug "Modifying display name, lore and other attributes"

    Do not use this method to modify the item's display name, lore, or other properties that are not required for the item to work server-side.  
    For that, use the `updatePacketItemData` function instead.

### `fun updatePacketItemData`

This method is called every time a packet that includes an `ItemStack` of a material with this `ItemBehavior` is sent to a player.  
Here, you can customize how the item is displayed for the player. Using the given `PacketItemData`, you can modify things
like the display name, lore (normal and advanced tooltips), the durability bar and more.

Confused? Take a look at [Understanding Packet Items](using-nova-item.md#understanding-packet-items).

### ItemBehaviorFactory

If you want to create item behaviors that can be added with a similar syntax as the default item behaviors, you'll need
to inherit from `ItemBehaviorFactory` in the companion object of your `ItemBehavior`. Then, implement the `create(NovaItem)`
function. Here, you can create an instance of your `ItemBehavior` based on the `NovaItem` that is passed to the function.

With `ConfigAccess`, you easily create a class that houses [config-reloadable properties](../configs.md) for your item behavior.  
Here is an example of how we implement
[ItemBehaviorFactory](https://github.com/xenondevs/Nova/blob/c87b0ab1e5a7e9cd441576425b9c6f20914e45c2/nova/src/main/kotlin/xyz/xenondevs/nova/item/behavior/Consumable.kt#L153-L156) and
[ConfigAccess](https://github.com/xenondevs/Nova/blob/c87b0ab1e5a7e9cd441576425b9c6f20914e45c2/nova/src/main/kotlin/xyz/xenondevs/nova/item/options/FoodOptions.kt)
for food items.

## Item Data

Data for Nova's ItemStacks is stored in a `NamespacedCompound`, which serializes data using [CBF](../../../../cbf/).  
You can retrieve the `NamespacedCompound` of an `ItemStack` by calling `#!kotlin ItemStack.novaCompound`.

!!! warning "NamespacedCompound"

    Unlike `ItemStack.itemMeta`, this `NamespacedCompound` is not a copy, so any changes you make to it will be reflected in the `ItemStack`.  
    However, the `NamespacedCompound` inside the `ItemStack` might be copied during normal tick logic, so you should not rely on the same
    (NMS) `ItemStack` to always contain the same `NamespacedCompound` instance.  
    *For example, while modifying the `ItemStack` retrieved during an `PlayerInteractEvent` a few ticks later will still
    change the `ItemStack` in the world, modifying the `NamespacedCompound` you've retrieved during the event will not affect
    the `ItemStack`. Instead, you'll need to retreive the `NovaCompound` again.*

Alternatively, you can also read and write data using `#!kotlin ItemStack.storeData` and `#!kotlin ItemStack.retrieveData`, which write
data to the `NamespacedCompound` for you.

!!! tip "Inspecting Item Data"
   
    You can also run the command `/nova debug itemData` to take a look at the data of the item stack in your hand.  
    Some of this data might be of an unknown type and will be displayed in binary format. The type will be known
    after `NamespacedCompound.get` and `NamespacedCompound.set` calls.