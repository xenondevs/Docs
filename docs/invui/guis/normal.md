Just a normal GUI without any special functionality.  
This example shows how to create one using the GUIBuilder:

=== "Kotlin"

    ```kotlin
    val border = SimpleItem(ItemBuilder(Material.BLACK_STAINED_GLASS_PANE))
    val gui = GUIBuilder(GUIType.NORMAL)
        .setStructure(
            "# # # # # # # # #",
            "# . . . . . . . #",
            "# . . . . . . . #",
            "# # # # # # # # #")
        .addIngredient('#', border)
        .build()
    ```

=== "Java"

    ```java
    Item border = new SimpleItem(new ItemBuilder(Material.BLACK_STAINED_GLASS_PANE));
    GUI gui = new GUIBuilder<>(GUIType.NORMAL)
        .setStructure(
            "# # # # # # # # #",
            "# . . . . . . . #",
            "# . . . . . . . #",
            "# # # # # # # # #")
        .addIngredient('#', border)
        .build();
    ```

<figure markdown>
  ![](https://i.imgur.com/MZmFbnJ.png){ width="360" }
  <figcaption>The example GUI from above</figcaption>
</figure>