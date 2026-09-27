---
icon: lucide/component
---

# Item Behaviors

To add custom functionality to your item type, create a class that implements the `ItemBehavior` interface. There are also some default behaviors available, not all of which are covered here. For a list of all available default item behaviors, refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.item.behavior/index.html).

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items {

   val EXAMPLE_ITEM = ExampleAddon.item("example_item") {
       behaviors(/* Item behaviors */)
   }

}
```

## Item use (right-click)

When a player right-clicks with your custom item type, `#!kotlin ItemBehavior.use` is called. For block interactions, `#!kotlin ItemBehavior.useOnBlock` is called. For entity interactions, `#!kotlin ItemBehavior.useOnEntity` is called. Each of these functions returns an `InteractionResult` that specifies how interaction handling should proceed: 

- `Success`: The interaction was successful. No further interaction handlers will be run. Depending on the parameters of `Success`, the player's hand will be swung and transformations, like reducing the count or applying damage, will be applied to the item stack. Additionally, post-use effects such as item cooldowns will be triggered.
- `Fail`: The interaction failed. No further interaction handlers will be run.
- `Pass`: Handling of this interaction is passed to the next handler.

??? abstract "interaction loop: right-click air"

    Note: If multiple item behaviors are defined, the handler functions will be called in the order the behaviors were defined. The loop is immediately exited once a handler returns a `Success` or `Fail` result.

    ```mermaid
    flowchart
        A["player right-clicks air\n with NovaItem"] --> IB_U

        IB_U["ItemBehavior.use"]
        IB_U -- "success" --> S("✔")
        IB_U -- "fail" --> F("✘")
        IB_U -- "pass" --> R
        
        R{"main hand?"}
        R -- "yes: retry with off-hand" --> IB_U
        R -- "no: fail" --> F5("✘")
    ```

??? abstract "interaction loop: right-click block"

    Note: If multiple item- or block behaviors are defined, the handler functions will be called in the order the behaviors were defined. The loop is immediately exited once a handler returns a `Success` or `Fail` result.

    ```mermaid
    flowchart
        A["player right-clicks\nNovaBlock with NovaItem"] --> B{"is sneaking?"}
    
        B -- "yes" --> IB_UOB
        B -- "no" --> BB_UIO
    
        BB_UIO["BlockBehavior.useItemOn"]
        BB_UIO -- "success" --> S1("✔")
        BB_UIO -- "fail" --> F1("✘")
        BB_UIO -- "pass" --> BB_U
    
        BB_U["BlockBehavior.use"]
        BB_U -- "success" --> S2("✔")
        BB_U -- "fail" --> F2("✘")
        BB_U -- "pass" --> IB_UOB
    
        IB_UOB["ItemBehavior.useOnBlock"]
        IB_UOB -- "success" --> S3("✔")
        IB_UOB -- "fail" --> F3("✘")
        IB_UOB -- "pass" --> IB_U
        
        IB_U["ItemBehavior.use"]
        IB_U -- "success" --> S4("✔")
        IB_U -- "fail" --> F4("✘")
        IB_U -- "pass" --> R
        
        R{"main hand?"}
        R -- "yes: retry with off-hand" --> B
        R -- "no: fail" --> F5("✘")
    ```

??? abstract "interaction loop: right-click entity"

    Note: If multiple item- or block behaviors are defined, the handler functions will be called in the order the behaviors were defined. The loop is immediately exited once a handler returns a `Success` or `Fail` result.

    ```mermaid
        flowchart
        A["player right-clicks\nentity with NovaItem"] --> B{"is sneaking?"}
        
        B -- "yes" --> IB_UOE
        B -- "no" --> EB_UIE
        
        EB_UIE["vanilla entity interaction"]
        EB_UIE -- "success" --> S1("✔")
        EB_UIE -- "fail" --> F1("✘")
        EB_UIE -- "pass" --> IB_UOE
        
        IB_UOE["ItemBehavior.useOnEntity"]
        IB_UOE -- "success" --> S3("✔")
        IB_UOE -- "fail" --> F3("✘")
        IB_UOE -- "pass" --> IB_U
        
        IB_U["ItemBehavior.use"]
        IB_U -- "success" --> S4("✔")
        IB_U -- "fail" --> F4("✘")
        IB_U -- "pass" --> R
        
        R{"main hand?"}
        R -- "yes: retry with off-hand" --> B
        R -- "no: fail" --> F5("✘")
    ```

## Item using (holding right-click)

You can make your item usable (i.e. add a right-click-and-hold action) in two ways:

- Add the `minecraft:consumable` component to your `baseDataComponents`. This will also affect server-side behavior.
- Override the server-side use duration via `modifyUseDuration` and call `#!kotlin LivingEntity.startUsingItem(EquipmentSlot)` in `use`. In order to get a client-side animation, change the client-side item type via `modifyClientSideItemType` to an item type that is usable (for example `minecraft:bow`) or apply the `minecraft:consumable` component to the client-side item stack via `modifyClientSideStack`.

??? question "How does item using work?"

    Item using is generally controlled by the server. When a player sends an interaction packet, the server can decide that the player should start using an item. Using can be started at any time via `#!kotlin LivingEntity.startUsingItem(EquipmentSlot)`. The use duration of Nova items is defined through `modifyUseDuration`.

    However, the server does not control the use animation directly. The use animation can only be set via the `minecraft:consumable` data component or by using a client-side item type that is hardcoded for a specific use animation, like `minecraft:bow`. Additionally, some item types have specialized using animations (like the zoom-in effect of `minecraft:bow`) that cannot be replicated by just the consumable component. Problematically, adding the consumable component or changing the client-side item type to something like `minecraft:bow` will cause client-side predictions which may not match with what your item behavior is trying to do. Disabling the usability of an item (e.g. for a custom bow implementation that only works with non-standard arrows) can only be achieved by dynamically updating the item stack in such a way that the client won't predict it to be usable anymore (e.g. by changing the client-side item type or by removing the consumable component). This may require you to repeatedly run logic in something like `handleEquipmentTick` and update the item stack appropriately if necessary.

While an entity is using the item `handleUseTick` is called. If using is aborted early, `handleUseStopped` is called. Otherwise, if the player keeps holding right-click until the specified use duration is elapsed, `handleUseFinished` is called. All of these functions can return an `ItemAction`, which can be used to apply transformations to the item stack, such as decrementing the count or applying damage. Any non-null `ItemAction` will also trigger post-use side effects like item cooldowns.

## Data components

The `ItemBehavior` interface specifies a `baseDataComponents` property, which are the default [data components](https://minecraft.wiki/w/Data_component_format) (also referred to as the prototype) of `NovaItems` with that behavior. This is a `#!kotlin Provider<DataComponentMap>`, which ties in with Nova's [config system](../configs.md), allowing you to make your base data components config-reloadable. Use the `buildDataComponentMapProvider` function to create a `#!kotlin Provider<DataComponentMap>`:

```kotlin
override val baseDataComponents: Provider<DataComponentMap> = buildDataComponentMapProvider {
    // item has max damage of 500
    this[DataComponentTypes.MAX_DAMAGE] = 500
    
    // item has a config-reloadable enchantable level taken from the "my_level" config entry
    this[DataComponentTypes.ENCHANTABLE] = Items.EXAMPLE_ITEM.config.entry<Int>(10, "my_level")
        .map { level -> Enchantable.enchantable(level) }
}
```

## Tags

Item behaviors can define a set of tags to which items of that behavior are added automatically. This tag set is also reactive and can be updated at any time, triggering a tag reload.  
Note, that item behaviors cannot create new tags. Tags must still be created through a Registrar first.

```kotlin
// Nova's "Chargeable" behavior automatically adds all items to the #nova:chargeable item tag.
override val tags: Provider<Set<RegistryEntrySet.Paper.Tag<ItemType>>> =
    provider(setOf(DefaultItemTags.CHARGEABLE))
```

## Client-side item stack

Nova modifies the server-side item stack into a client-readable version before sending it to the client (for example, since the vanilla game does not support custom item types, the item type is translated to `shulker_shell` and the data component prototype is applied as the patch).  
This mechanism is exposed to addons, allowing you to modify the client-side item stack however you want.


For example, some functionality is still hardcoded to the item type. For such cases, you can change the client-side item type by overriding `modifyClientSideItemType`.

To modify the entire client-side item stack, you can override `modifyClientSideStack`. The data of the client-side stack will not be stored in the world and is only intended for display purposes. Furthermore, the components of the client-side stack will not affect the tooltip, e.g. adding the `DAMAGE` component will not cause the damage value to be shown in the advanced tooltip. (Assuming advanced tooltips are handled by Nova via `/nova advancedTooltips`).

!!! note "Inspecting client-side item data"

    You can inspect the client-side version of a server-side item stack by creating a client-side copy via `/nova debug giveClientsideStack`, then run `/paper dumpitem` to print the item data in chat.

## ItemBehaviorFactory

`ItemBehaviorFactory` creates `ItemBehavior` instances based on the item's registry entry and config. This allows you to create factories for your `ItemBehaviors` that read from the item's config file.

```kotlin title="Example custom ItemBehavior with ItemBehaviorFactory"
class MyBehavior(value: Provider<Int>) : ItemBehavior {

   private val value by value // (1)!

   companion object : ItemBehaviorFactory<MyBehavior> {
       
      override fun create(entry: RegistryEntry.Paper<ItemType>, config: ConfigProvider): MyBehavior {
         return MyBehavior(config.entry<Int>(1, "value"))
      }
      
   }

}
```

1. Delegating to the obtained provider makes this property config-reloadable without any additional code.

Now, you can assign the same `ItemBehaviorFactory` to multiple items, while still accessing different configs for each item:

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

Arbitrary data can be stored inside the item stack via Bukkit's [persistent data container (PDC)](https://docs.papermc.io/paper/dev/pdc).

Instead of writing a custom PDC serializer, you can optionally also use Nova's `#!kotlin ItemStack.storeData` and `#!kotlin ItemStack.retrieveData` extension functions, which use [CBF](../../../../cbf/) for (de)serialization.
