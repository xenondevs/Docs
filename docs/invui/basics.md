# InvUI Basics

Displaying an inventory to a player requires two things: a [GUI](guis/index.md) and a Window  
The GUI contains all UI Elements [Items](items.md), while a Window actually displays it to a user and is directly tied to a Bukkit inventory.  
Not tying the GUI to a specific inventory type (like Chest, Dropper, Hopper or Anvil) allows for a much more flexible usage as well as nested GUIs, which can be very helpful when you're trying to create a more complex menu.

## Creating a GUI with the GuiBuilder
Every `...Gui` interface has static methods to create the specific `Gui.Builder`.  
If the GUI can have multiple types, such as paged GUIs being able to display a list of items or a list of GUIs,
the methods are named `.items()` or `.guis()` respectively.  
If there is only one type, the method is named `.normal()`. This is the case for the default and tab GUI.

This is an example of how you would go about creating a default Gui using the GuiBuilder:

=== "Kotlin"

    ```kotlin
    val gui = Gui.normal() // Creates the GuiBuilder for a normal GUI
        .setStructure(
            "# # # # # # # # #",
            "# . . . . . . . #",
            "# . . . . . . . #",
            "# # # # # # # # #")
        .addIngredient('#', SimpleItem(ItemBuilder(Material.BLACK_STAINED_GLASS_PANE)))
        .build()
    ```
=== "Java"

    ```java
    Gui gui = Gui.normal() // Creates the GuiBuilder for a normal GUI
        .setStructure(
            "# # # # # # # # #",
            "# . . . . . . . #",
            "# . . . . . . . #",
            "# # # # # # # # #")
        .addIngredient('#', new SimpleItem(new ItemBuilder(Material.BLACK_STAINED_GLASS_PANE)))
        .build();
    ```

Then, create a Window and show it to a player:

=== "Kotlin"

    ```kotlin
    val window = Window.single()
        .setViewer(player)
        .setTitle("InvUI")
        .setGui(gui)
        .build()
    
    window.open()
    ```

=== "Java"

    ```java
    Window window = Window.single()
        .setViewer(player)
        .setTitle("InvUI")
        .setGui(gui)
        .build();
    
    window.open();
    ```

![](https://i.imgur.com/MZmFbnJ.png)

## Creating a GUI without the GuiBuilder

If you don't want to use the GuiBuilder, you can also call the static factory methods in the `Gui` interfaces.

=== "Kotlin"

    ```kotlin
    // create the GUI
    val gui = Gui.empty(9, 4)
    
    // set items using x and y coordinates
    gui.setItem(0, 0, item)
    
    // set an item using the slot index
    gui.setItem(10, item)
    
    // use a Structure to add items (like in the GuiBuilder)
    val structure: Structure = Structure(
        "# # # # # # # # #",
        "# . . . . . . . #",
        "# . . . . . . . #",
        "# # # # # # # # #")
        .addIngredient('#', item)
    
    gui.applyStructure(structure)
    ```

=== "Java"

    ```java
    // create the GUI
    Gui gui = Gui.empty(9, 4);
    
    // set items using x and y coordinates
    gui.setItem(0, 0, item);
    
    // set an item using the slot index
    gui.setItem(10, item);
    
    // use a Structure to add items (like in the GuiBuilder)
    Structure structure = new Structure(
        "# # # # # # # # #",
        "# . . . . . . . #",
        "# . . . . . . . #",
        "# # # # # # # # #")
        .addIngredient('#', item);
    
    gui.applyStructure(structure);
    ```

## Items in GUIs

So now that you know how to create GUIs, you'll need to add UI Elements (`Items`) to them.
I have already shown one type of `Item`, the `SimpleItem`.  
The `SimpleItem` is a static `Item`. It cannot change its appearance and doesn't do anything when clicked. This makes it perfect for placeholders like glass panes, which don't do anything.  
To create your own Item type, you'll need to inherit from either `BaseItem` (if you want to be able to change its appearance) or `SimpleItem` (if you don't need to change its appearance).
In this example, I inherited from `BaseItem`.  
Every time a player clicks on the `Item`, a counter will be incremented and the number on the Item will change.

=== "Kotlin"

    ```kotlin
    class CountItem : BaseItem() {
        
        private var count = 0
        
        override fun getItemProvider(): ItemProvider {
            return ItemBuilder(Material.DIAMOND).setDisplayName("Count: $count")
        }
        
        override fun handleClick(clickType: ClickType, player: Player, event: InventoryClickEvent) {
            if (clickType.isLeftClick) {
                count++ // increment if left click
            } else {
                count-- // else decrement
            }
            notifyWindows() // this will update the ItemStack that is displayed to the player
        }
        
    }
    ```

=== "Java"

    ```java
    public class CountItem extends BaseItem {
        
        private int count;
        
        @Override
        public ItemProvider getItemProvider() {
            return new ItemBuilder(Material.DIAMOND).setDisplayName("Count: " + count);
        }
        
        @Override
        public void handleClick(@NotNull ClickType clickType, @NotNull Player player, @NotNull InventoryClickEvent event) {
            if (clickType.isLeftClick()) {
                count++; // increment if left click
            } else {
                count--; // else decrement
            }
            
            notifyWindows(); // this will update the ItemStack that is displayed to the player
        }
        
    }
    ```

The `notifyWindows` call is very important. It will tell all Windows that are currently displaying that Item to redraw it. They will call the `getItemProvider` method and display the new ItemStack to the Player.

After adding the Item to the GUI as described above, it will look like this:

![](https://i.imgur.com/bTEFRqc.gif)

**For more information about UI Items in InvUI, visit the [Items](items.md) page.**
