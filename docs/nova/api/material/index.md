# NovaMaterial

``NovaMaterial`` is the material class for items and blocks added by Nova.

## Getting a ``NovaMaterial`` by name

To get a ``NovaMaterial`` you first have to get the ``NovaMaterialRegistry`` using [the previously retrieved Nova instance](../index.md).

=== "Kotlin"

    ```kotlin
    val materialRegistry = Nova.materialRegistry
    ```

=== "Java"

    ```java
    NovaMaterialRegistry materialRegistry = nova.getMaterialRegistry(); // (1)!
    ```

    1. "nova" is the previously retrieved Nova instance, preferably saved in a field/variable.<br>You can also call ``Nova.getNova().getMaterialRegistry()``

Using this registry, you can now get a ``NovaMaterial`` by id. It needs to be in the format ``namespace:name``.

=== "Kotlin"

    ```kotlin
    val material = materialRegistry.get("nova:wrench") // (1)!
    ```

    1. This will throw an exception if the material is not found. However, wrench always exists.<br>If you're unsure or processing user input use ``getOrNull`` instead.

=== "Java"

    ```java
    NovaMaterial material = materialRegistry.get("nova:wrench"); // (1)!
    ```

    1. This will throw an exception if the material is not found. However, wrench always exists.<br>If you're unsure or processing user input use ``getOrNull`` instead.


!!! info

    The same methods also exist for getting a ``NovaMaterial`` from an ``ItemStack``.

If you want to retrieve all materials with a certain name and ignore the namespace, you can do this:

=== "Kotlin"

    ```kotlin
    val materials = materialRegistry.getNonNamespaced("wrench")
    ```

=== "Java"

    ```java
    List<NovaMaterial> materials = materialRegistry.getNonNamespaced("wrench");
    ```

## Getting the id of a material

Example for ``nova:wrench``:

=== "Kotlin"

    ```kotlin
    val id = material.id
    
    val namespace = id.namespace // "nova"
    val name = id.name // "wrench"
    val idString = id.toString() // "nova:wrench"
    ```

=== "Java"

    ```java
    NamespacedId id = material.getId();

    String namespace = id.getNamespace(); // "nova"
    String name = id.getName(); // "wrench"
    String idString = id.toString(); // "nova:wrench"
    ```

## Getting the translated name of a material

Nova uses the resource pack to translate items client side. However, if you still need to get the translated name of a material, 
you can use ``NovaMaterial.getLocalizedName(locale)``. The locale is the language code of the language you want to get the name in.
The code is the same as the language code used by [Minecraft](https://minecraft.fandom.com/wiki/Language).

!!! info

    If the given language code could not be found or is invalid, the english name of the material will be returned.

Example for ``nova:wrench``:

=== "Kotlin"

    ```kotlin
    val name = material.getLocalizedName("de_de") // "Schraubenschlüssel"
    ```

=== "Java"

    ```java
    String name = material.getLocalizedName("de_de"); // "Schraubenschlüssel"
    ```