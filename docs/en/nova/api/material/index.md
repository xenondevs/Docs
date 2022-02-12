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
    NovaMaterialRegistry materialRegistry = nova.getMaterialRegistry(); // (1)
    ```

    1. "nova" is the previously retrieved Nova instance, preferably saved in a field/variable.<br>You can also call ``Nova.getNova().getMaterialRegistry()``

Using this registry, you can now get a ``NovaMaterial`` by name. This name can be formatted with or without the ``nova:`` prefix.

=== "Kotlin"

    ```kotlin
    val material = materialRegistry.get("nova:wrench") // (1)
    ```

    1. This will throw an exception if the material is not found. However, wrench always exists.<br>If you're unsure or processing user input use ``getOrNull`` instead.

=== "Java"

    ```java
    NovaMaterial material = materialRegistry.get("nova:wrench"); // (1)
    ```

    1. This will throw an exception if the material is not found. However, wrench always exists.<br>If you're unsure or processing user input use ``getOrNull`` instead.

The same methods also exist for getting a ``NovaMaterial`` by modelData or directly from a bukkit ``ItemStack``.

## Getting the id of a material

The id of a material is the name of the material in lowercase with ``nova:`` added in front.

Example for the wrench:

=== "Kotlin"

    ```kotlin
    val id = material.id // "nova:wrench"
    ```

=== "Java"

    ```java
    String id = material.getId(); // "nova:wrench"
    ```

## Getting the translated name of a material

Nova uses the resource pack to translate items client side. However, if you still need to get the translated name of a material, 
you can use ``NovaMaterial.getLocalizedName(locale)``. The locale is the language code of the language you want to get the name in.
The code is the same as the language code used by [Minecraft](https://minecraft.fandom.com/wiki/Language).

!!! info

    If the given language code could not be found or is invalid, the english name of the material will be returned.

Example for the wrench:

=== "Kotlin"

    ```kotlin
    val name = material.getLocalizedName("de_de") // "Schraubenschlüssel"
    ```

=== "Java"

    ```java
    String name = material.getLocalizedName("de_de"); // "Schraubenschlüssel"
    ```