# Items

In InvUI, the UI elements are just called `Item`s.  

Every `Item` has an ``ItemProvider`` which returns ``ItemStacks`` based on a locale.
This behavior allows for easy localization of UI elements, as you can show the same `Item` and `Gui` instances to multiple
players while still having everything translated into their respective languages.

Unlike other inventory libraries, InvUI does not redraw items every tick. To trigger an update, call ``item.notifyWindows();``.
This will notify all ``Windows`` that are currently displaying that ``Item`` to call ``Item#getItemProvider`` and ``ItemProvider#get`` and display the updated item to their viewer.

### Default ItemProviders
InvUI comes with two default implementations of `ItemProvider`: `ItemWrapper` and `ItemBuilder`.  
`ItemWrapper` just wraps an existing `ItemStack` and returns it when asked, `ItemBuilder` allows you to create
`ItemStacks` using a builder pattern with [localization support](localization.md) through translatable components.

## Default UI Items in InvUI
InvUI provides a few basic items, but you will probably have to create your own ones for more complicated behavior.

| Item           | Description                                                                                              |
|----------------|----------------------------------------------------------------------------------------------------------|
| AsyncItem      | Creates it's ItemProvider asynchronously and displays a placeholder ItemProvider until the task is done. |
| AutoCycleItem  | Automatically cycles between an array of ItemProviders.                                                  |
| AutoUpdateItem | Automatically updates its ItemProvider on a timer.                                                       |
| CommandItem    | Makes the player execute a command or write a message in chat when clicked.                              |
| CycleItem      | Cycles through an array of ItemProviders when clicked.                                                   |
| SimpleItem     | Just displays an ItemProvider.                                                                           |
| SuppliedItem   | Displays an ItemProvider from a Supplier<ItemProvider>.                                                  |

If you don't need any behavior at all and just want to make your ``GUI`` look pretty, you can use the ``SimpleItem``. It cannot update it's ``ItemProvider`` later on and does not have any on-click functionality.

## Creating your own Item
To create your own Item, you'll need to inherit from either ``AbstractItem`` (if you want to be able to change its appearance) or ``SimpleItem`` (if you don't need to change its appearance).
In this example, I inherited from ``AbstractItem``.
Every time a player clicks on the Item, a counter will be incremented and the number on the Item will change.

=== "Kotlin"

    ```kotlin
    class CountItem : AbstractItem() {
        
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
    public class CountItem extends AbstractItem {
        
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

After adding the Item to the GUI, it will look like this:  
![](https://i.imgur.com/bTEFRqc.gif)

## ControlItems
A `ControlItem` is a special sort of `Item`: When it is added to a `GUI`, the `GUI` will be saved inside the `ControlItem`.  
You can also manually assign a GUI to a `ControlItem` by calling `ControlItem#setGUI`.  
So, what are `ControlItems` used for? You guessed it, controlling `GUIs`. Page switching buttons are one example, as they need to call ``PagedGUI#goForward`` and ``PagedGUI#goBack`` which would not be possible without having the instance of the ``GUI`` to control saved somewhere.

This would be a simple implementation of `ControlItem` for a paged GUI:

=== "Kotlin"

    ```kotlin
    class ChangePageItem : ControlItem<PagedGui<*>>() {
        
        override fun handleClick(clickType: ClickType, player: Player, event: InventoryClickEvent) {
            if (clickType == ClickType.LEFT) {
                gui.goForward() // go one page forward on left-click
            } else if (clickType == ClickType.RIGHT) {
                gui.goBack() // go one page back on right-click
            }
        }
        
        override fun getItemProvider(gui: PagedGui<*>): ItemProvider {
            return ItemBuilder(Material.BLACK_STAINED_GLASS_PANE)
                .setDisplayName("§7Current page: " + (gui.currentPage + 1)) // + 1 because we don't want to have "Current page: 0"
                .addLoreLines("§8Left-click to go forward", "§8Right-click to go back")
        }
        
    }
    ```

=== "Java"

    ```java
    public class ChangePageItem extends ControlItem<PagedGui<?>> {
        
        @Override
        public void handleClick(@NotNull ClickType clickType, @NotNull Player player, @NotNull InventoryClickEvent event) {
            if (clickType == ClickType.LEFT) {
                getGui().goForward(); // go one page forward on left-click
            } else if (clickType == ClickType.RIGHT) {
                getGui().goBack(); // go one page back on right-click
            }
        }
        
        @Override
        public ItemProvider getItemProvider(PagedGui<?> gui) {
            return new ItemBuilder(Material.BLACK_STAINED_GLASS_PANE)
                .setDisplayName("§7Current page: " + (gui.getCurrentPage() + 1)) // + 1 because we don't want to have "Current page: 0"
                .addLoreLines("§8Left-click to go forward", "§8Right-click to go back");
        }
        
    }
    ```

The `getItemProvider` method will get called when the page changes, as `PagedGui` internally calls `AbstractGui#updateControlItems`, so the displayed page number in this example item will always be correct.