# Block Registry

The block registry contains all registered block types.

You can get the ``BlockRegistry`` using [the previously retrieved Nova instance](../index.md).

=== "Kotlin"

    ```kotlin
    val blockRegistry = Nova.blockRegistry
    ```

=== "Java"

    ```java
    BlockRegistry blockRegistry = Nova.getNova().getBlockRegistry();
    ```

After that, you can retrieve a block type by its id:

=== "Kotlin"

    ```kotlin
    val block = blockRegistry.getBlock("machines:pulverizer")
    ```

=== "Java"

    ```java
    NovaBlock block = blockRegistry.getBlock("machines:pulverizer");
    ```