---
icon: lucide/apple
---

# Items - Overview

You can create a really simple item type that has no functionality like this:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)! 
object Items /* (2)! */ {

   val EXAMPLE_ITEM = ExampleAddon.item("example_item") {}
   
}
```

1. Nova will load this class during addon initialization, causing your items to be registered.
2. For organizational purposes, it makes sense to create one singleton object per "thing", e.g. `Items`, `Blocks`, `GuiTextures`, etc. But you can also run `ExampleAddon.item` from anywhere else, as long as its during the right initialization stage.

!!! info "Default model and texture"
    The item's model defaults to `models/item/example_item.json`. If that doesn't exist, Nova will just instead try to display `textures/item/example_item.png` directly.

Logic is added to the item via [item behaviors](item-behaviors.md). There are also built-in item behaviors, for example for [tools](tools.md), [equipment](equipment.md), and more.

The visual appearance of the item is controlled via [item model definitions](item-model-definitions.md) and the models they point to.

!!! bug "Prefer `ItemType` over `Material`"

    Nova's custom item types are exposed as Bukkit's `ItemType`. Since `Material` cannot represent custom item types, you should avoid using it as it can lead to incorrectly intepreting Nova items as vanilla items.  
    Since Paper has not fully migrated to `ItemType` yet, Nova adds several extension functions, e.g., for retrieving an `ItemType` from an `ItemStack` without going through `Material`.
