Just a normal GUI without any special functionality.  
This example shows how to create one using the GuiBuilder:

=== "Kotlin"

    ```kotlin
    val border = SimpleItem(ItemBuilder(Material.BLACK_STAINED_GLASS_PANE))
    val gui = Gui.normal()
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
    Gui gui = Gui.normal()
        .setStructure(
            "# # # # # # # # #",
            "# . . . . . . . #",
            "# . . . . . . . #",
            "# # # # # # # # #")
        .addIngredient('#', border)
        .build();
    ```

![](https://i.imgur.com/MZmFbnJ.png)