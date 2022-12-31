# Structure

## Creating and using Structures

Inspired by Bukkit's ShapedRecipe, a Structure will let you design the layout of the GUI in a similar way.  
Each ingredient is associated with a character and you "draw" the GUI in your code.

This is an example I stole from the [Paged GUI](guis/paged.md) section:

=== "Kotlin"

    ```kotlin
    // create a structure
    val structure = Structure(
        "# # # # # # # # #",
        "# x x x x x x x #",
        "# x x x x x x x #",
        "# # # < # > # # #")
        .addIngredient('x', Markers.ITEM_LIST_SLOT_HORIZONTAL) // where paged items should be put
        .addIngredient('#', ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r")) // this will just create a SimpleItem with the given ItemBuilder
        .addIngredient('<', BackItem())
        .addIngredient('>', ForwardItem())

    // use it in a GUI Builder
    GUIBuilder(GUIType.PAGED_ITEMS).setStructure(structure)
    
    // or use it on an existing GUI
    gui.applyStructure(structure)
    ```

=== "Java"

    ```java
    // create a structure
    Structure structure = new Structure(
        "# # # # # # # # #",
        "# x x x x x x x #",
        "# x x x x x x x #",
        "# # # < # > # # #")
        .addIngredient('x', Markers.ITEM_LIST_SLOT_HORIZONTAL) // where paged items should be put
        .addIngredient('#', new ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r")) // this will just create a SimpleItem with the given ItemBuilder
        .addIngredient('<', new BackItem())
        .addIngredient('>', new ForwardItem());

    // use it in a GUI Builder
    new GUIBuilder<>(GUIType.PAGED_ITEMS).setStructure(structure);

    // or use it on an existing GUI
    gui.applyStructure(structure);
    ```

As you can see, there are many types of ingredients that can be added:
`Items`, `Item Supplier`, `SlotElement`, `SlotElement Supplier`, `VirtualInventory`, `Marker`.  
When using an `Item` or `SlotElement as ingredient, the same instance will be used on every slot.
If you don't want this, use an Item Supplier. This will create a new instance for every slot.

## Global Ingredients

If you're reusing the same ingredients over and over again, consider registering them as global ingredients.  
Make sure to use suppliers for every item where you want a new instance per slot.


=== "Kotlin"
    
    ```kotlin
    // Supplier is not needed here as the Item does not do anything
    Structure.addGlobalIngredient('#', ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r"))
    
    // These items need a supplier
    Structure.addGlobalIngredient('<', ::BackItem)
    Structure.addGlobalIngredient('>', ::ForwardItem)
    
    // Adding the Markers.ITEM_LIST_SLOT_HORIZONTAL as a global ingredient is also a good idea
    Structure.addGlobalIngredient('x', Markers.ITEM_LIST_SLOT_HORIZONTAL)
    ```

=== "Java"

    ```java
    // Supplier is not needed here as the Item does not do anything
    Structure.addGlobalIngredient('#', new ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r"));

    // These items need a supplier because ControlItems can only control one GUI
    Structure.addGlobalIngredient('<', BackItem::new);
    Structure.addGlobalIngredient('>', ForwardItem::new);

    // Adding the Markers.ITEM_LIST_SLOT_HORIZONTAL as a global ingredient is also a good idea
    Structure.addGlobalIngredient('x', Markers.ITEM_LIST_SLOT_HORIZONTAL);
    ```