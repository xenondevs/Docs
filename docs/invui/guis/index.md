## What is a GUI in InvUI?

A GUI is basically a container for width * height SlotElements.
Each SlotElement can either be an Item, a reference to another GUI or a reference to a VirtualInventory.

Items and other SlotElements can be added using `gui.setItem(x, y, item);`, `gui.setItem(index, item);` or by using a Structure and applying that to the GUI `gui.applyStructure(structure);`.

GUIs cannot display anything to a player, a Window is used for that.

## Different types of GUIs

There are four different GUI types available:

* [Normal GUI](normal.md)
* [Paged GUI](paged.md)
* [Scroll GUI](scroll.md)
* [Tab GUI](tab.md)

## Animations

GUIs can also play animations with `gui.playAnimation(animation);`.  
While an animation is running, the player can't interact with any Item in the GUI.


Available Animations:

* SequentialAnimation
* SplitSequentialAnimation
* HorizontalSnakeAnimation
* VerticalSnakeAnimation
* RowAnimation
* ColumnAnimation
* RandomAnimation

To cancel a running animation, use `gui.cancelAnimation();`

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