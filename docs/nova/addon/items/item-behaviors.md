# Item Behaviors

In Nova, item logic is implemented via `ItemBehaviors`.
There are some default behaviors available, but you can also create your own custom behaviors.

## Default Item Behaviors

!!! example "Default Item Behaviors"

    These are the default item behaviors that Nova provides:

    === "Consumable"

        Allows you to make a custom consumable item. Example:

        ```kotlin
        val EXAMPLE_ITEM = registerItem("example_item", Consumable)
        ```

        ```yaml title="configs/example_item.yml"
         
        # The nutrition value this food provides.
        nutrition: 4
        # The saturation this food provides.
        saturation: 0.3
        # Whether the food can always be eaten, or only when hungry.
        can_always_eat: false
        # The time it takes for the food to be consumed, in ticks.
        consume_time: 40
        # The item stack that remains after the food is consumed.
        remains: "minecraft:bowl"
        # A list of effects to apply to the player when this food is consumed.
        effects: []
        ```

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
              probability: 1.0 # (7)!
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
            7. The probability of the effect being applied.
               Defaults to `1.0`.
               

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

        You can also use this behavior with [custom armor textures](armor.md).

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

## Custom Item Behaviors

You can create a custom item behavior by implementing the `ItemBehavior` interface.

There, you'll be able to override `baseDataComponents`, which are the default
[data components](https://minecraft.wiki/w/Data_component_format) of `NovaItems` with that behavior.

Alternatively, you can also override `defaultPatch`, which is the default component patch that will be present
on all item stacks of `NovaItems` with that behavior.

### Vanilla material properties

Some functionality can not yet be achieved by using data components, as it is still bound to the vanilla item type.
As such, you can specify [VanillaMaterialProperties](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.item.vanilla/-vanilla-material-property/index.html)
which will change the **client-side** item type.

### Client-side item stack

To modify the [client-side item](using-nova-item.md#client-side-items), you can override `modifyClientSideStack`.
The data of the client-side stack will not be stored in the world and is only intended for display purposes.
Furthermore, the components of the client-side stack will not affect the tooltip, e.g. adding the `DAMAGE` component
will not cause the damage value to be shown in the advanced tooltip. (Assuming advanced tooltips are handled by Nova
via `/nova advancedTooltips`).

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

Data for Nova's ItemStacks can be stored in a `NamespacedCompound`, which serializes data using [CBF](../../../../cbf/).  
You can retrieve the `NamespacedCompound` of an `ItemStack` by calling `#!kotlin ItemStack.novaCompound`.
After updating it, you'll need to write it back to the `ItemStack`.

Alternatively, you can also read and write data using `#!kotlin ItemStack.storeData` and `#!kotlin ItemStack.retrieveData`,
which access the `NamespacedCompound` for you.

`NovaItems` can also have default data stored in their `NamespacedCompound`, which can be applied using the `defaultCompound`
property in a custom `ItemBehavior`.

Of course, you can also use Bukkit's [persistent data container](https://docs.papermc.io/paper/dev/pdc) for data storage.