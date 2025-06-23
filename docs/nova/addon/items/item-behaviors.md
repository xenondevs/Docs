# Item Behaviors

In Nova, item logic is implemented via `ItemBehaviors`.
There are some default behaviors available, but you can also create your own custom behaviors.

## Default Item Behaviors

For a list of all available default item behaviors, refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.item.behavior/index.html).

## Custom Item Behaviors

You can create a custom item behavior by implementing the `ItemBehavior` interface.

### Base data components

The `ItemBehavior` interface specifies a `baseDataComponents` property, which are the default
[data components](https://minecraft.wiki/w/Data_component_format) of `NovaItems` with that behavior.

Example usage:
```kotlin
override val baseDataComponents: Provider<DataComponentMap> = buildDataComponentMapProvider {
    // item has max damage of 500
    this[DataComponentTypes.MAX_DAMAGE] = 500
    
    // item has a config-reloadable enchantable level taken from the "my_level" config entry
    this[DataComponentTypes.ENCHANTABLE] = Items.EXAMPLE_ITEM.config.entry<Int>("my_level")
        .map { level -> Enchantable.enchantable(level) }
}
```

### Vanilla material properties

Some functionality can not yet be achieved by using data components, as it is still bound to the vanilla item type.
For such cases, you can specify [VanillaMaterialProperties](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.item.vanilla/-vanilla-material-property/index.html)
which will change the **client-side** item type.

### Client-side item stack

To modify the [client-side item](using-nova-item.md#client-side-items), you can override `modifyClientSideStack`.
The data of the client-side stack will not be stored in the world and is only intended for display purposes.
Furthermore, the components of the client-side stack will not affect the tooltip, e.g. adding the `DAMAGE` component
will not cause the damage value to be shown in the advanced tooltip. (Assuming advanced tooltips are handled by Nova
via `/nova advancedTooltips`).

!!! note "Inspecting client-side item data"

    You can inspect the client-side version of a server-side item stack by creating a client-side copy via
    `/nova debug giveClientsideStack`, then run `/paper dumpitem` to print the item data in chat.

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
object Items {
    
    val EXAMPLE_ITEM_1 = ExampleAddon.registerItem("example_1", MyBehavior) // configs/example_1.yml
    val EXAMPLE_ITEM_2 = ExampleAddon.registerItem("example_2", MyBehavior) // configs/example_2.yml
    val EXAMPLE_ITEM_3 = ExampleAddon.registerItem("example_3", MyBehavior) // configs/example_3.yml
   
}
```

1. Nova will load this class during addon initialization, causing the item fields to be initialized and your items to be registered.

## Item Data

Data for Nova's ItemStacks can be stored using [CBF](../../../../cbf/) via the extension functions 
`#!kotlin ItemStack.storeData` and `#!kotlin ItemStack.retrieveData`.
Default data for this can be added into an ItemBehavior's `defaultCompound`.

Alternatively, it is also possible to store data in Bukkit's [persistent data container](https://docs.papermc.io/paper/dev/pdc).