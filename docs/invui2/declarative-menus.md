!!! warning "This functionality is experimental"

!!! warning "This functionality is exclusive to invui-kotlin"

When designing non-trivial menus, managing state and performing manual updates can become difficult. To help with this, InvUI provides a way to design menus in a declarative / reactive fashion.

For that, InvUI uses `#!kotlin Provider<T>` and `#!kotlin MutableProvider<T>` from [commons-provider](https://commons-provider.dokka.xenondevs.xyz/commons-provider/xyz.xenondevs.commons.provider/index.html), with which you can model a reactive data flow. This means that you can have a top `#!kotlin Provider<T>` that holds your state and then derive other providers from it, like transforming a `String` to an `ItemProvider`, which can then be used for display purposes in a gui. The derived providers will automatically update when the top provider (i.e. your state) changes.

```kotlin
val p = mutableProvider(1)
val p1 = p.map { it + 1 }

println(p1.get()) // 2

p1.set(2)

println(p1.get()) // 3
```

For example, the following menu automatically updates its search preview as the user types. The state of the text input is stored in a `#!kotlin MutableProvider<String>` and the content of the paged gui is derived from it by searching the available materials for a matching name.

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

Additionally, InvUI provides a [DSL (domain-specific language)](https://kotlinlang.org/docs/type-safe-builders.html) that makes creating windows, guis, and items more concise. This DSL is focused entirely around managing state via providers.

```kotlin
anvilWindow(player) {
    lowerGui by pagedItemsGui(
        "x x x x x x x x x",
        "x x x x x x x x x",
        "x x x x x x x x x",
        "x x x x x x x x x"
    ) {
        'x' by Markers.CONTENT_LIST_SLOT_HORIZONTAL // (1)!
        content by text.map { search -> // (2)!
            Material.entries
                .filter { !it.isLegacy && it.isItem }
                .filter { it.name.contains(search, true) }
                .map { Item.simple(ItemBuilder(it)) }
        }
    }
}.open()
```

1. The `by` infix function is used to assign a value to the key `x`. You can also set other ingredient types like `Item` or `Inventory`.
2. `#!kotlin text: Provider<String>` is brought into scope by the `anvilWindow` function. This provider contains to up-to-date anvil input text. In this DSL, `by` infix functions are used instead of assignment (`=`) to allow overloading. For example, you can also set a `List<Item>` directly, if you want to use a static list of items.

![](assets/img/window/anvil_search.avif){width=500}