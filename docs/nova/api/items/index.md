``NovaItem`` represents an item type. It is similar to ``Material`` in Bukkit, except that it is only for items.

## Getting a ``NovaItem`` by name

To get a ``NovaItem`` you first have to get the ``NovaItemRegistry`` using [the previously retrieved Nova instance](../index.md).

=== "Kotlin"

    ```kotlin
    val itemRegistry = Nova.itemRegistry
    ```

=== "Java"

    ```java
    NovaItemRegistry itemRegistry = nova.getItemRegistry(); // (1)!
    ```

    1. "nova" is the previously retrieved Nova instance, preferably saved in a field/variable.<br>You can also call ``Nova.getNova().getItemRegistry()``

Using this registry, you can now get a ``NovaItem`` by id. It needs to be in the format ``namespace:name``.

=== "Kotlin"

    ```kotlin
    val item = itemRegistry.get("nova:wrench") // (1)!
    ```

    1. This will throw an exception if the item is not found. However, wrench always exists.<br>If you're unsure or processing user input use ``getOrNull`` instead.

=== "Java"

    ```java
    NovaItem item = itemRegistry.get("nova:wrench"); // (1)!
    ```

    1. This will throw an exception if the item is not found. However, wrench always exists.<br>If you're unsure or processing user input use ``getOrNull`` instead.


!!! info

    The same methods also exist for getting a ``NovaItem`` from an ``ItemStack``.

If you want to retrieve all items with a certain name and ignore the namespace, you can do this:

=== "Kotlin"

    ```kotlin
    val items = itemRegistry.getNonNamespaced("wrench")
    ```

=== "Java"

    ```java
    List<NovaItem> items = itemRegistry.getNonNamespaced("wrench");
    ```

## Getting the id of an item

Example for ``nova:wrench``:

=== "Kotlin"

    ```kotlin
    val id = item.id
    
    val namespace = id.namespace // "nova"
    val name = id.name // "wrench"
    val idString = id.toString() // "nova:wrench"
    ```

=== "Java"

    ```java
    NamespacedId id = item.getId();

    String namespace = id.getNamespace(); // "nova"
    String name = id.getName(); // "wrench"
    String idString = id.toString(); // "nova:wrench"
    ```

## Getting the translated name of an item

Nova uses the resource pack to translate items client side. However, if you still need to get the translated name of an item,
you can use ``NovaItem.getLocalizedName(locale)``. The locale is the language code of the language you want to get the name in.
The code is the same as the language code used by [Minecraft](https://minecraft.fandom.com/wiki/Language).

!!! info

    If the given language code could not be found or is invalid, the english name of the item will be returned.

Example for ``nova:wrench``:

=== "Kotlin"

    ```kotlin
    val name = item.getLocalizedName("de_de") // "Schraubenschlüssel"
    ```

=== "Java"

    ```java
    String name = item.getLocalizedName("de_de"); // "Schraubenschlüssel"
    ```