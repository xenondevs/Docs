A Scroll GUI allows you to scroll through a list of items line by line.
This can be done both vertically and horizontally.

## Control Items

Before creating the Scroll GUI itself, you first need to create the Items for navigating it.

This would be an example for an Item that scrolls down:

=== "Kotlin"

    ```kotlin
    class ScrollDownItem : ScrollItem(1) {
        
        override fun getItemProvider(gui: ScrollGui<*>): ItemProvider {
            val builder = ItemBuilder(Material.GREEN_STAINED_GLASS_PANE)
            builder.setDisplayName("§7Scroll down")
            if (!gui.canScroll(1))
                builder.addLoreLines("§cYou can't scroll further down")
            return builder
        }
        
    }
    ```

=== "Java"

    ```java
    public class ScrollDownItem extends ScrollItem {
        
        public ScrollDownItem() {
            super(1);
        }
        
        @Override
        public ItemProvider getItemProvider(ScrollGui<?> gui) {
            ItemBuilder builder = new ItemBuilder(Material.GREEN_STAINED_GLASS_PANE);
            builder.setDisplayName("§7Scroll down");
            if (!gui.canScroll(1))
                builder.addLoreLines("§cYou can't scroll further down");
            
            return builder;
        }
        
    }
    ```

And this Item scrolls up:

=== "Kotlin"

    ```kotlin
    class ScrollUpItem : ScrollItem(-1) {
        
        override fun getItemProvider(gui: ScrollGui<*>): ItemProvider {
            val builder = ItemBuilder(Material.RED_STAINED_GLASS_PANE)
            builder.setDisplayName("§7Scroll up")
            if (!gui.canScroll(-1))
                builder.addLoreLines("§cYou've reached the top")
            return builder
        }
        
    }
    ```

=== "Java"

    ```java
        public class ScrollUpItem extends ScrollItem {
        
        public ScrollUpItem() {
            super(-1);
        }
        
        @Override
        public ItemProvider getItemProvider(ScrollGui<?> gui) {
            ItemBuilder builder = new ItemBuilder(Material.RED_STAINED_GLASS_PANE);
            builder.setDisplayName("§7Scroll up");
            if (!gui.canScroll(-1))
                builder.addLoreLines("§cYou've reached the top");
            
            return builder;
        }
        
    }
    ```

!!! info

    You also might want to register these Items as [global ingredients](../structure.md).

## Creating the GUI

### Scroll Items

Now that we've created the ControlItems, let's make the actual GUI:

=== "Kotlin"

    ```kotlin
    val border = SimpleItem(ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r"))
    
    // an example list of items to display
    val items = Material.values()
        .filter { !it.isAir && it.isItem }
        .map { SimpleItem(ItemBuilder(it)) }

    val gui = ScrollGui.items()
        .setStructure(
            "x x x x x x x x u",
            "x x x x x x x x #",
            "x x x x x x x x #",
            "x x x x x x x x #",
            "x x x x x x x x d")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_VERTICAL)
        .addIngredient('#', border)
        .addIngredient('u', ScrollUpItem())
        .addIngredient('d', ScrollDownItem())
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
    
    Gui gui = ScrollGui.items()
        .setStructure(
            "x x x x x x x x u",
            "x x x x x x x x #",
            "x x x x x x x x #",
            "x x x x x x x x #",
            "x x x x x x x x d")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_VERTICAL)
        .addIngredient('#', border)
        .addIngredient('u', new ScrollUpItem())
        .addIngredient('d', new ScrollDownItem())
        .setContent(items)
        .build();
    ```

And this is how it looks in-game:  
![](https://i.imgur.com/TQ3yXxT.gif)

You can also change the scroll direction by using `Markers.CONTENT_LIST_SLOT_VERTICAL` instead of `Markers.CONTENT_LIST_SLOT_HORIZONTAL`.
This would result in the gui scrolling from left to right:  
![](https://i.imgur.com/HoeAhyx.gif)

!!! info

    If you need even more control over the scroll direction, you'll need to set the `itemListSlots`
    yourself by calling the ScrollGui.of method.

### `ScrollGui<Gui>` & `ScrollGui<VirtualInventory>`

There are two additional Scroll GUI types available: `ScrollGui.guis()` and `ScrollGui.inventories()`.
They behave in a very similar way to `ScrollGui.items()`, but instead of Items, they accept GUIs or [Inventories](../inventory.md).
For the case of `ScrollGui<Gui>`, you'll want to make sure that the width of the GUIs matches the line size of your Scroll GUI.
