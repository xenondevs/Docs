# InvUI Basics

Displaying an inventory to a player requires two things: a [GUI](guis/index.md) and a Window  
The GUI contains all UI Elements [Items](items.md), while a Window actually displays it to a user and is directly tied to a Bukkit inventory.  
Not tying the GUI to a specific inventory type (like Chest, Dropper, Hopper or Anvil) allows for a much more flexible usage as well as nested GUIs, which can be very helpful when you're trying to create a more complex menu.

## Creating a GUI with the GUIBuilder
This is an example of how you would go about creating a GUI using the GUIBuilder:

=== "Kotlin"

    ```kotlin
    val gui = GUIBuilder(GUIType.NORMAL)
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
    GUI gui = new GUIBuilder<>(GUIType.NORMAL)
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
    SimpleWindow(player, "InvUI", gui).show()
    ```

=== "Java"

    ```java
    new SimpleWindow(player, "InvUI", gui).show();
    ```

![](https://i.imgur.com/MZmFbnJ.png)

## Creating a GUI without the GUI Builder

If you can't to use the GUI Builder for whatever reason, it is also possible to create GUIs manually.  
The normal GUI type is called `SimpleGUI` and this is how you would use it:

=== "Kotlin"

    ```kotlin
    // create the GUI
    val gui = SimpleGUI(9, 4)
    
    // set items using x and y coordinates
    gui.setItem(0, 0, item)
    
    // set an item using the slot index
    gui.setItem(10, item)
    
    // use a Structure to add items (like in the GUI Builder)
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
    GUI gui = new SimpleGUI(9, 4);
    
    // set items using x and y coordinates
    gui.setItem(0, 0, item);
    
    // set an item using the slot index
    gui.setItem(10, item);
    
    // use a Structure to add items (like in the GUI Builder)
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
