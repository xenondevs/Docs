# Item Behaviors

In Nova, item logic is implemented via `ItemBehaviors`.
There are some default behaviors available, but you can also create your own custom behaviors.

## Default Item Behaviors

For a list of all available default item behaviors, refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.item.behavior/index.html).

## Custom Item Behaviors

You can create a custom item behavior by implementing the `ItemBehavior` interface.

There, you'll be able to override `baseDataComponents`, which are the default
[data components](https://minecraft.wiki/w/Data_component_format) of `NovaItems` with that behavior.

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