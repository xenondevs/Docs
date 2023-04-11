## What is a GUI in InvUI?

A GUI is basically a container for width * height SlotElements.
Each SlotElement can either be an Item, a reference to another GUI or a reference to a VirtualInventory.

Items and other SlotElements can be added using `gui.setItem(x, y, item);`, `gui.setItem(index, item);` or by using a Structure and applying that to the GUI `gui.applyStructure(structure);`.

GUIs cannot display anything to a player, a Window is used for that.

## Different types of GUIs

There are four different GUI types available:

| Gui Type                | Builder Factory Function(s)                                                             | Description                                                                                                                                                                      |
|-------------------------|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Normal GUI](normal.md) | `#!java Gui.normal()`                                                                   | A normal GUI without any special functionality.                                                                                                                                  |
| [Paged GUI](paged.md)   | `#!java PagedGui.items()`, `#!java PagedGui.guis()`                                     | A GUI with paging functionality. You can either provide a list of [`Items`](../items.md) that should be shown on the pages or directly provide the pages (as `Guis`) themselves. |
| [Scroll GUI](scroll.md) | `#!java ScrollGui.items()`, `#!java ScrollGui.guis()`, `#!java ScrollGui.inventories()` | A GUI with scrolling functionality. You can scroll through [`Items`](../items.md), `Guis` or [`Inventories`](../inventory.md)                                                    |
| [Tab GUI](tab.md)       | `#!java TabGui.normal()`                                                                | A GUI with tabs. Each tab is associated to a `Gui`, you can switch between tabs using tab items.                                                                                 |

## Animations

GUIs can also play animations with `#!java gui.playAnimation(animation);`.  
While an animation is running, the player can't interact with any Item in the GUI.


Available Animations:

* SequentialAnimation
* SplitSequentialAnimation
* HorizontalSnakeAnimation
* VerticalSnakeAnimation
* RowAnimation
* ColumnAnimation
* RandomAnimation

To cancel a running animation, use `#!java gui.cancelAnimation();`

## Filling methods

There are also some utility methods for filling available:

=== "Kotlin"

    ```kotlin
    gui.fill(item, replace) // fills everything
    gui.fill(start, end, item, replace) // fills from the start index to the end index
    gui.fillColumn(column, item, replace) // fills a column
    gui.fillRow(row, item, replace) // fills a row
    gui.fillBorders(item, replace) // fill the borders
    gui.fillRectangle(x, y, width, height, item, replace) // fills a rectangle with an Item

    gui.fillRectangle(x, y, gui, replace) // fills a rectangle with another GUI
    gui.fillRectangle(x, y, width, virtualInventory, replace) // fills a rectangle with a VirtualInventory
    ```

=== "Java"

    ```java
    gui.fill(item, replace); // fills everything
    gui.fill(start, end, item, replace); // fills from the start index to the end index
    gui.fillColumn(column, item, replace); // fills a column
    gui.fillRow(row, item, replace); // fills a row
    gui.fillBorders(item, replace); // fill the borders
    gui.fillRectangle(x, y, width, height, item, replace); // fills a rectangle with an Item

    gui.fillRectangle(x, y, gui, replace); // fills a rectangle with another GUI
    gui.fillRectangle(x, y, width, virtualInventory, replace); // fills a rectangle with a VirtualInventory
    ```

## Background Item

Every GUI can also have an ``ItemProvider`` as the background. This background Item will be shown when there is nothing occupying that slot. It can be useful for dealing with paged GUIs if you don't want any blank spots in your inventory.
You can set the background via:

=== "Kotlin"

    ```kotlin
    gui.setBackground(itemProvider)
    ```

=== "Java"

    ```java
    gui.setBackground(itemProvider);
    ```