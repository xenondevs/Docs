# Tab GUI

A Tab GUI lets you switch between different GUIs (tabs) by clicking the Tab Items associated with them.

## Control Items

First, we'll need to create our Tab Items:

=== "Kotlin"

    ```kotlin
    class MyTabItem(private val tab: Int) : TabItem(tab) {
        
        override fun getItemProvider(gui: TabGui): ItemProvider {
            return if (gui.currentTab == tab) {
                ItemBuilder(Material.GLOWSTONE_DUST)
                    .setDisplayName("Tab $tab (selected)")
            } else {
                ItemBuilder(Material.GUNPOWDER)
                    .setDisplayName("Tab $tab (not selected)")
            }
        }
        
    }
    ```

=== "Java"

    ```java
    public class MyTabItem extends TabItem {
        
        private final int tab;
        
        public MyTabItem(int tab) {
            super(tab);
            this.tab = tab;
        }
        
        @Override
        public ItemProvider getItemProvider(TabGui gui) {
            if (gui.getCurrentTab() == tab) {
                return new ItemBuilder(Material.GLOWSTONE_DUST)
                    .setDisplayName("Tab " + tab + " (selected)");
            } else {
                return new ItemBuilder(Material.GUNPOWDER)
                    .setDisplayName("Tab " + tab + " (not selected)");
            }
        }
        
    }
    ```

## Creating the GUI

Now, lets create the actual TabGui. In this example, I've only created two tabs, but you can have as many tabs as you want.

=== "Kotlin"

    ```kotlin
    val border = SimpleItem(ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r"))
    
    val gui1 = Guis.empty(9, 3)
    gui1.fill(SimpleItem(ItemBuilder(Material.DIRT)), true)
    
    val gui2 = Guis.empty(9, 3)
    gui2.fill(SimpleItem(ItemBuilder(Material.DIAMOND)), true)
    
    val gui = TabGui.normal()
        .setStructure(
            "# # # 0 # 1 # # #",
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_VERTICAL)
        .addIngredient('#', border)
        .addIngredient('0', MyTabItem(0))
        .addIngredient('1', MyTabItem(1))
        .setTabs(listOf(gui1, gui2))
        .build()
    ```

=== "Java"

    ```java
    Item border = new SimpleItem(new ItemBuilder(Material.BLACK_STAINED_GLASS_PANE).setDisplayName("§r"));
    
    Gui gui1 = Guis.empty(9, 3);
    gui1.fill(new SimpleItem(new ItemBuilder(Material.DIRT)), true);
    
    Gui gui2 = Guis.empty(9, 3);
    gui2.fill(new SimpleItem(new ItemBuilder(Material.DIAMOND)), true);
    
    Gui gui = TabGui.normal()
        .setStructure(
            "# # # 0 # 1 # # #",
            "x x x x x x x x x",
            "x x x x x x x x x",
            "x x x x x x x x x")
        .addIngredient('x', Markers.CONTENT_LIST_SLOT_VERTICAL)
        .addIngredient('#', border)
        .addIngredient('0', new MyTabItem(0))
        .addIngredient('1', new MyTabItem(1))
        .setTabs(Arrays.asList(gui1, gui2))
        .build();
    ```

And this is how it looks like:  
![](https://i.imgur.com/tO4Rc06.gif){ align=center }

!!! info

    It is also possible to, for example, put the Tab Items in a separate paged or scroll gui if you need more space.  
    For that to work, you'd need to set the TabGUI that the Tab items are supposed to control manually using `ControlItem#setGui`.
