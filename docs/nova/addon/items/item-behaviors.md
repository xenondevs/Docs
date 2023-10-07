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
               A list of all effect types can be found [here](https://minecraft.wiki/w/Effect#Effect_list).
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
        you can check out the [Minecraft wiki](https://minecraft.wiki/w/Armor#Defense_points).

    === "Tool"
    
        See [Tools](../tools).

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

        See [Enchantments](../enchantments).

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
your own. Just create a new class and implement the ``ItemBehavior`` interface.
Instead of registering event handlers, you can override the `handle...()` functions, which are invoked when something is done
with an `ItemStack` of a `NovaItem` with that behavior.

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

Gets a list of `AttributeModifiers`.

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
   it from other `AttributeModifiers`. It is important that different `AttributeModifier`s have different `UUID`s.
2. The attribute that should be modified.
3. The operation that should be done.
4. The value that should be used for the operation. In this case, the movement speed will be increased by 10%.
5. Whether the attribute modifier should be shown in the `ItemStack`'s lore.
6. The equipment slot(s) that this attribute modifier should be applied to.

### `fun getDefaultCompound`

This function is used to specify default CBF data for all `ItemStacks` of `NovaItems` that use this `ItemBehavior`.  
All default compounds from all `ItemBehehaviors` are merged together and always applied to new `ItemStack` of that type.

### `fun updatePacketItemData`

This method is called every time a packet that includes an `ItemStack` of a material with this `ItemBehavior` is sent to a player.  
Here, you can customize how the item is displayed for the player. Using the given `PacketItemData`, you can modify things
like the display name, lore (normal and advanced tooltips), the durability bar and more.

Confused? Take a look at [Understanding Packet Items](using-nova-item.md#understanding-packet-items).

### ItemBehaviorHolder and ItemBehaviorFactory

`ItemBehaviorHolder` is a sealed interface with two implementations: `ItemBehavior` and `ItemBehaviorFactory`, where
`ItemBehaviorFactory` creates `ItemBehavior` instances based on a `NovaItem` instance. This allows you to create
factories for your `ItemBehaviors` that read from the item's config file.  

```kotlin title="Example custom ItemBehavior with ItemBehaviorFactory"
class MyBehavior(value: Provider<Int>) : ItemBehavior {

   private val value by value // (1)!

   companion object : ItemBehaviorFactory<MyBehavior> {
       
      override fun create(item: NovaItem): MyBehavior {
         return MyBehavior(item.config.entry<Int>("value"))
      }
      
   }

}
```

1. Delegating to the obtained provider makes this property config-reloadable without any additional code.

Now, you could, for example, assign the same `ItemBehaviorFactory` to multiple items, while still accessing
different configs.

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Items : ItemRegistry by ExampleAddon.registry {
    
    val EXAMPLE_ITEM_1 = registerItem("example_1", MyBehavior) // configs/example_1.yml
    val EXAMPLE_ITEM_2 = registerItem("example_2", MyBehavior) // configs/example_2.yml
    val EXAMPLE_ITEM_3 = registerItem("example_3", MyBehavior) // configs/example_3.yml
    
   
}
```

1. Nova will load this class during addon initialization, causing the item fields to be initialized and your items to be registered.

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