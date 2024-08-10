## Creating an Item Registry

To create a custom item, you'll first need to create an `ItemRegistry`:
```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)! 
object Items ItemRegistry by ExampleAddon.registry {
    
    // (2)!
    
}
```

1. Nova will load this class during addon initialization, causing your items to be registered.
2. Register your items here

## Creating Items

You can register a really simple item like this:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items ItemRegistry by ExampleAddon.registry {

   val EXAMPLE_ITEM = registerItem("example_item", /* Item Behaviors */)
   
}
```

This item will default to the model under `models/item/example_item.json` or alternatively create a basic item model
with the texture `textures/item/example_item.png`.

For more specialized cases, you might want to customize the item model, or give your item multiple models:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items ItemRegistry by ExampleAddon.registry {

   val EXAMPLE_ITEM = item("example_item") {
      models {
         selectModel {
            getModel(/* path */) // (1)!
         }
         
         selectModel("some_variant") {
             getModel(/* path */) // (2)!
         }
         
         selectModel(0..10, "item/example_item_variant_%s") // (3)!
      }
   }
   
}
```

1. Configures the path for the default model.
2. Configures the path for the named model `some_variant`.
3. Configures paths for named models "0" - "10" as `item/example_item_variant_0` up to `item/example_item_variant_10`

!!! note "Refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.item/-nova-item-builder/index.html) for a full list of available functions and properties."