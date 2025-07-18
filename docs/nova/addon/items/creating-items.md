## Creating an Item Registry

First, create an empty singleton object and annotate it like this:
```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)! 
object Items {
    
    // (2)!
    
}
```

1. Nova will load this class during addon initialization, causing your items to be registered.
2. Register your items here

## Creating Items

You can register a really simple item like this:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items {

   val EXAMPLE_ITEM = ExampleAddon.registerItem("example_item", /* Item Behaviors */)
   
}
```

This item will default to the model under `models/item/example_item.json` or alternatively create a basic item model
with the texture `textures/item/example_item.png`.

## Item Model Definitions

!!! info "Item Model Definitions - Minecraft Wiki"
    
    Item Model Defintions are a 1.21.4 feature. You may be interested in the
    [Minecraft wiki page](https://minecraft.wiki/w/Items_model_definition) on this topic.

Nova offers a DSL builder for creating item model definitions:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items {

   val EXAMPLE_ITEM = ExampleAddon.item("example_item") {
      modelDefinition {
          model = /* ... */
      }
   }
   
}
```

In this scope, you'll need to set the "root" model of the item.
Your options here are:

- `model`: A normal model, allows defining tints. You may want to use the shortcut function `buildModel` instead.
- `composite`: A composite model, which allows rendering multiple models in the same space.
- `condition`: A model is selected based on a condition that is either `true` or `false`.
- `select`: A model is selected based on a value, such as an enum or a string.
- `rangeDispatch`: A model is selected based on a number. If there is no exact match, the closest lower value is used.
- `empty`: An empty model
- Various "special" models, that use hardcoded rendering logic.

There are also some shortcut functions available for generating `rangeDispatch` models: `numberedModels`, `rangedModels`

Models are nested, so you can have, for example, a `select` model that chooses another `select` model.

!!! note "Refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.resources.builder.layout.item/-item-model-creation-scope/index.html) for a full list of available functions and properties."

### Model

This is the most basic model type. You will need this type as a leaf of all your models, as it is the only
type that directly links to a model file. Additionally, this type also allows you to define tints.

```kotlin title="modelDefinition { }"
model = model {
    tintSource[0] = TintSource.CustomModelData(Color.WHITE, 0) // (1)!
    model = { getModel("item/my_item") } // (2)!
}
```

1. This sets `tintindex` 0 to read the color value 0 from the `minecraft:custom_model_data` component.
2. This sets the model to `item/my_item`. In the model selector scope, you have additional functionality available
   that can be used to generate models at runtime.

### Composite

This model type allows you to render multiple models in the same space.

```kotlin title="modelDefinition { }"
model = composite {
  models += /* ... */ // (1)!
}
```

1. Adds a model to the composite. You can either create a model like for the root model, or define a model selector
   lambda directly.

### Condition

This model type allows you to choose a model based on a condition.

```kotlin title="modelDefinition { }"
model = condition(ConditionItemModelProperty.KeybindDown(Keybind.LEFT)) { // (1)!
    onTrue = buildModel { getModel("item/left") } // (2)!
    onFalse = buildModel { getModel("item/not_left") }
}
```

1. This condition checks if the keybind `LEFT` is pressed. If it is, the model `item/left` is used, otherwise `item/not_left`.
2. `#!kotlin buildModel { /* ... */ }` is a shortcut for `#!kotlin model { model = { /* ... */ } }`.

### Select

This model type allows you to choose a model based on a value.

```kotlin title="modelDefinition { }"
model = select(SelectItemModelProperty.ChargedType) { // (1)!
    case[ChargedType.NONE] = { getModel("item/crossbow")}
    case[ChargedType.ARROW] = { getModel("item/crossbow_arrow")}
    case[ChargedType.ROCKET] = composite { /* ... */ }
}
```

1. Selects over the value of the `minecraft:charged_projectile`.

### Range Dispatch

```kotlin title="modelDefinition { }"
model = rangeDispatch(RangeDispatchItemModelProperty.Cooldown) { // (1)!
    entry[0] = { getModel("item/my_item_ready") }
    entry[0.5] = { getModel("item/my_item_half_ready") }
    entry[1] = { getModel("item/my_item_not_ready") }
}
```

1. Selects a model based on the value of the `minecraft:cooldown` component. You can add as many
   intermediate models as you want. The client will always render the one with the closest lower value.

### Special

There are various special model types available. These use hardcoded rendering logic and are not achievable through
regular model files.

The following special models exist:  
`bedSpecialModel`, `bannerSpecialModel`, `conduitSpecialModel`, `chestSpecialModel`, `decoratedPotSpecialModel`
`headSpecialModel`, `shulkerBoxSpecialModel`, `shieldSpecialModel`, `standingSignSpecialModel`, `tridentSpecialModel`,
`hangingSignSpecialModel`

```kotlin title="modelDefinition { }"
model = chestSpecialModel {
    texture = ResourcePath.of(ResourceType.ChestTexture, "my_addon:iron_chest")
    openness = 0.5
}
```

## NovaItem

### Getting an ItemStack
To get an ItemStack from a `NovaItem`, use `#!kotlin NovaItem.createItemStack(amount)`.

### Getting ItemBehaviors
Using the function `#!kotlin hasItemBehavior<T>()` and `#!kotlin getItemBehavior<T>()` you can check for and get an ItemBehavior of
a certain type.

### Client-side items

Using `NovaItem.clientsideProvider` and `NovaItem.createClientsideItemBuilder()` you can obtain client-side items.

To understand the difference between a normal (server-side) and a client-side item, you first need to understand how custom
items are handled in Nova.  
In order to be extremely flexible when it comes to changing custom model data, the underlying vanilla item type, the lore
format of the item or its display name, Nova's ItemStacks do not store this information at all.
All of these values are actually only applied on packet level, which can be observed by running the command
`/data get entity @p SelectedItem` while holding an item from Nova: its item type will always be `shulker_shell` and it
won't have any custom model data, display name or lore, even though it has one for your game.

Coming back to client-side item builders and providers: These are wrappers for the ItemStacks that the client actually sees.
They should only be used in cases where the ItemStack isn't actually stored anywhere, for example as a button in a GUI
or for `FakeEntities`.

!!! abstract "Generally, you should use `NovaItem.clientsideProvider` and `NovaItem.createClientsideItemBuilder()` when working with GUIs and `#!kotlin NovaItem.createItemStack(amount)` if you need an item to give to a player."
