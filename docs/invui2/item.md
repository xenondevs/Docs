# Item

## What is an Item?

InvUI's UI elements are called `Item`. You can think of an `Item` as a button, though not every `Item` needs to do something when it is clicked.
An `Item` consists of the following components:

* `ItemProvider`: This is the visual representation of the `Item`, i.e. an `ItemStack`. `ItemProvider` also allows for easy localization. InvUI's built-in `ItemBuilder` is an `ItemProvider`, but you can also just wrap any `ItemStack` using `ItemWrapper`.
* Click handler(s): Click handlers are code that is run when a player clicks on the item. An item can also have no click handlers, i.e. nothing happens and the item remains where it was. (and will not be picked up!)

You can create a very simple item like this:

```kotlin
val item = Item.builder()
    .setItemProvider(ItemBuilder(Material.DIAMOND)) // the item is represented by a diamond
    .addClickHandler { item, click -> println("Hello World!") } // "Hello World" is printed to the console on click
    .build()
```

For purely decorative items, you can use `#!kotlin Item.simple`:

```kotlin
val item = Item.simple(ItemBuilder(Material.DIAMOND))
```

## Item Updating

Of course, in a real-world scenario, you'll want to update the visual representation of the item dynamically. To do that, first define an item provider lambda instead of a constant item provider. However, that alone will not automatically update your item. To trigger an update, which calls your item provider lambda and refreshes the displayed `ItemStack`, you will need to call `#!kotlin Item.notifyWindows()`:

```kotlin
var count = 0
val item: Item = Item.builder()
    .setItemProvider { ItemBuilder(Material.DIAMOND).setName("Click count: $count") }
    .addClickHandler { item, click ->
        count++
        item.notifyWindows()
    }.build()
```

This can be shortened a little by using `updateOnClick`:

```kotlin
var count = 0
val item: Item = Item.builder()
    .setItemProvider { ItemBuilder(Material.DIAMOND).setName("Click count: $count") }
    .addClickHandler { _, click -> count++ }
    .updateOnClick()
    .build()
```

![](assets/img/item/updateOnClick.gif){width=500}

In certain scenarios, it may make sense to update your item based on a timer:

```kotlin
val item: Item = Item.builder()
    .setItemProvider { ItemBuilder(Material.DIAMOND).setName("Current time: ${System.currentTimeMillis()}") }
    .updatePeriodically(1) // Updates the item provider every tick
    .build()
```

![](assets/img/item/updatePeriodically.gif){width=500}

There are also various methods available on gui-level that allow mass-updating multiple items at the same time. 

!!! tip "If you're using `invui-kotlin`, the best way is to handle item updating is to use the [declarative gui](declarative-menu-design.md) design approach."

## Bundle selection

Minecraft's bundle item adds unique inventory interactions to the game. You can also use bundles in InvUI. Simply register a bundle selection handler via `addBundleSelectHandler`:

```kotlin
val bundleItem: Item = Item.builder()
    .setItemProvider(
        ItemBuilder(Material.BUNDLE).set(
            DataComponentTypes.BUNDLE_CONTENTS,
            BundleContents.bundleContents().addAll(/* ... */).build()
        )
    )
    .addBundleSelectHandler { _, _, selectedSlot -> println("Slot selected: $selectedSlot") }
    .build()
```

??? example "Example: Menu with bundle select handler"

    ```kotlin
    val wools: List<ItemStack> = Tag.WOOL.values.map(ItemStack::of)
    
    var selectedWool: Int = -1
    val display: Item = Item.builder()
        .setItemProvider { wools.getOrNull(selectedWool)?.let(::ItemBuilder) ?: ItemProvider.EMPTY }
        .build()
    
    val bundleItem: Item = Item.builder()
        .setItemProvider(
            ItemBuilder(Material.BUNDLE).set(
                DataComponentTypes.BUNDLE_CONTENTS,
                BundleContents.bundleContents().addAll(wools).build()
            )
        )
        .addBundleSelectHandler { _, _, selectedSlot ->
            selectedWool = selectedSlot
            display.notifyWindows()
        }
    
    Window.builder()
        .setUpperGui(Gui.builder()
            .setStructure("b # # # # # # # #")
            .addIngredient('b', bundleItem)
            .addIngredient('#', display)
        )
        .setLowerGui(Gui.of(9, 4, display))
        .open(player)
    ```
    
    ![](assets/img/item/bundleSelect.gif){width=500}

## Bound Item

Normal items have no awareness of which `Gui` they are a part of. However, sometimes the item is supposed to display the state of a gui or interact with it in some other way. A concrete example for this would be page buttons in a `PagedGui`. They need to call methods on `PagedGui` in order to switch to the next page.
This is where bound items come in: This special item type remembers the first `Gui` it is added to (it is "bound" to that gui) and passes this information on to the click handler.

```kotlin
val boundItem: BoundItem = BoundItem.builder()
    // The bind handlers are run when the item is bound to a gui, i.e. when it is added to a gui.
    // They can be used to register handlers on the gui, which then in turn refresh the item on certain actions (like page a change)
    // You will likely not need to register bind handlers yourself, as pre-made bound items exist for all gui types that do this for you already
    .addBindHandler { item, gui -> /* ... */ }
    // Like a normal item's click handler, except that it also retrieves the gui instance
    .addClickHandler { item, gui, click -> /* ... */ }
    .build()    
```

The topic of bound items will be covered again in the [gui](guis.md) section where needed. 

!!! bug "Re-using bound item instances"

    Note that bound items are bound to the **first** gui they are added to. This means that you cannot re-use the same `BoundItem` instance across multiple guis. If you're registering bound items as global ingredients or in ingredient presets, make sure to pass the `BoundItem.Builder` and not a concrete `BoundItem` instance:

    ```kotlin
    val boundItemBuilder = BoundItem.builder()
        /* ... */
    
    // DO NOT DO THIS
    // 'x' will always be the same BoundItem instance
    Structure.addGlobalIngredient('x', boundItemBuilder.build())
    
    // DO THIS INSTEAD
    // 'x' will be a new BoundItem instance, built from boundItemBuilder, every time
    Structure.addGlobalIngredient('x', boundItemBuilder)
    ```