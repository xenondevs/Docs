!!! warning "This functionality is experimental"

!!! warning "This functionality is exclusive to invui-kotlin"

Windows, Guis, and Items can be designed in a declarative-ish / reactive fashion.

For that, InvUI uses `Provider<T>` and `MutableProvider<T>` from [commons-provider](https://commons.dokka.xenondevs.xyz/commons-provider/xyz.xenondevs.commons.provider/index.html).

In a nutshell, with providers you can define a reactive data transformation flow:

```kotlin
val p = mutableProvider("Hello")
val p1 = p.map { "$it, World!" }

println(p1.get()) // prints "Hello, World!"

p.set("Goodbye")

println(p1.get()) // prints "Goodbye, World!"
```

This is very useful for creating menus, as it removes the need for manual updates like `notifyWindows()` or `setContent()`.

For example, the following menu automatically updates its search preview as the user types.

```kotlin
val search = mutableProvider("")
AnvilWindow.builder()
    .addRenameHandler(search) // automatically writes text into search provider
    .setLowerGui(PagedGui.itemsBuilder()
        .setStructure(
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x"
        )
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_HORIZONTAL)
        .setContent(search) { search -> // content updates based on search provider (1)
            Material.entries
                .filter { !it.isLegacy && it.isItem }
                .filter { it.name.contains(search, true) }
                .map { Item.simple(ItemBuilder(it)) }
        }
    )
    .open(player)
```

1. This is equivalent to:
    ```kotlin
    setContent(search.map { search ->
        Material.entries
            .filter { !it.isLegacy && it.isItem }
            .filter { it.name.contains(search, true) }
            .map { Item.simple(ItemBuilder(it)) }
    })
    ```

![](assets/img/window/anvil_search.gif){width=500}