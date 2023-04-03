## Getting a `NovaBlock` from an id

`NovaBlock` is a block type, similar to `Material` in Bukkit, except that it is only for blocks.

To retrieve a `NovaBlock` from an id, you can do the following:

=== "Kotlin"

    ```kotlin
    val block = blockManager.getBlock("machines:pulverizer")
    ```

=== "Java"

    ```java
    NovaBlock block = blockManager.getBlock("machines:pulverizer");
    ```