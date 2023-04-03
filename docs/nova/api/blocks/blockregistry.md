# Block Registry

The block registry contains all registered block types.

You can get the ``BlockRegistry`` using [the previously retrieved Nova instance](../index.md).

=== "Kotlin"

    ```kotlin
    val blockManager = Nova.blockRegistry
    ```

=== "Java"

    ```java
    BlockRegistry blockManager = Nova.getNova().getBlockRegistry();
    ```

After that, you can retrieve a block type by its id:

=== "Kotlin"

    ```kotlin
    val block = blockManager.getBlock("machines:pulverizer")
    ```

=== "Java"

    ```java
    NovaBlock block = blockManager.getBlock("machines:pulverizer");
    ```