A paged GUI is a gui that can display pages of either `Items` or `Guis`.  

## Control Items

First, we'll need to create the page switching buttons.  
This is an example for a "Page Back" Item:

=== "Kotlin"

    ```kotlin
    class BackItem : PageItem(false) {
        
        override fun getItemProvider(gui: PagedGui<*>): ItemProvider {
            val builder = ItemBuilder(Material.RED_STAINED_GLASS_PANE)
            builder.setDisplayName("§7Previous page")
                .addLoreLines(
                    if (gui.hasPreviousPage())
                        "§7Go to page §e" + gui.currentPage + "§7/§e" + gui.pageAmount 
                    else "§cYou can't go further back"
                )
            return builder
        }
        
    }
    ```

=== "Java"

    ```java
    public class BackItem extends PageItem {
    
        public BackItem() {
            super(false);
        }
    
        @Override
        public ItemProvider getItemProvider(PagedGui<?> gui) {
            ItemBuilder builder = new ItemBuilder(Material.RED_STAINED_GLASS_PANE);
            builder.setDisplayName("§7Previous page")
                .addLoreLines(gui.hasPreviousPage()
                    ? "§7Go to page §e" + gui.getCurrentPage() + "§7/§e" + gui.getPageAmount()
                    : "§cYou can't go further back");
            
            return builder;
        }
    
    }
    ```

This is an example for a "Page Forward" Item:

=== "Kotlin"

    ```kotlin
    class ForwardItem : PageItem(true) {
        
        override fun getItemProvider(gui: PagedGui<*>): ItemProvider {
            val builder = ItemBuilder(Material.GREEN_STAINED_GLASS_PANE)
            builder.setDisplayName("§7Next page")
                .addLoreLines(
                    if (gui.hasNextPage())
                        "§7Go to page §e" + (gui.currentPage + 2) + "§7/§e" + gui.pageAmount 
                    else "§cThere are no more pages"
                )
            return builder
        }
        
    }
    ```

=== "Java"

    ```java
    public class ForwardItem extends PageItem {
    
        public ForwardItem() {
            super(true);
        }
    
        @Override
        public ItemProvider getItemProvider(PagedGui<?> gui) {
            ItemBuilder builder = new ItemBuilder(Material.GREEN_STAINED_GLASS_PANE);
            builder.setDisplayName("§7Next page")
                .addLoreLines(gui.hasNextPage()
                    ? "§7Go to page §e" + (gui.getCurrentPage() + 2) + "§7/§e" + gui.getPageAmount()
                    : "§cThere are no more pages");
        
            return builder;
        }
    
    }
    ```

_More information about ControlItems in the [Items](../items.md) section._

!!! info

    You also might want to register these Items as [global ingredients](../structure.md).

## Creating the GUI

### Paged Items

Now that we've created the ControlItems, let's make the actual GUI:

=== "Kotlin"

    ```kotlin
    val border = SimpleItem(ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r"))
    
    // an example list of items to display
    val items = Material.values()
        .filter { !it.isAir && it.isItem }
        .map { SimpleItem(ItemBuilder(it)) }
    
    // create the gui
    val gui = PagedGui.items()
        .setStructure(
            "# # # # # # # # #",
            "# x x x x x x x #",
            "# x x x x x x x #",
            "# # # < # > # # #")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_HORIZONTAL) // where paged items should be put
        .addIngredient('#', border)
        .addIngredient('<', BackItem())
        .addIngredient('>', ForwardItem())
        .setContent(items)
        .build()
    ```

=== "Java"

    ```java
    Item border = new SimpleItem(new ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r"));
    
    // an example list of items to display
    List<Item> items = Arrays.stream(Material.values())
        .filter(material -> !material.isAir() && material.isItem())
        .map(material -> new SimpleItem(new ItemBuilder(material)))
        .collect(Collectors.toList());
    
    // create the gui
    Gui gui = PagedGui.items()
        .setStructure(
            "# # # # # # # # #",
            "# x x x x x x x #",
            "# x x x x x x x #",
            "# # # < # > # # #")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_HORIZONTAL) // where paged items should be put
        .addIngredient('#', border)
        .addIngredient('<', new BackItem())
        .addIngredient('>', new ForwardItem())
        .setContent(items)
        .build();
    ```

In-game, it will look like this:  
![](https://i.imgur.com/hyGz4V6.gif)

### Paged GUIs

Instead of using Items, you can also use whole GUIs as pages.
In the following example I used two slightly different versions of the GUI created above and added them as pages.
Now I can switch between two paged GUIs.

=== "Kotlin"

    ```kotlin
    val gui = PagedGui.items()
        .setStructure(
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x",
            ". . < . . . > . .")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_HORIZONTAL) // where paged items should be put (in this case: the parts of the nested GUI)
        .addIngredient('<', BackItem())
        .addIngredient('>', ForwardItem())
        .setContent(listOf(page1GUI, page2GUI))
        .build()
    ```

=== "Java"

    ```java
    Gui gui = PagedGui.items()
        .setStructure(
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x",
            ". . < . . . > . .")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_HORIZONTAL) // where paged items should be put (in this case: the parts of the nested GUI)
        .addIngredient('<', new BackItem())
        .addIngredient('>', new ForwardItem())
        .setContent(Arrays.asList(page1GUI, page2GUI))
        .build();
    ```

In-game it looks like this:  
![](https://i.imgur.com/ZySN7cW.gif)