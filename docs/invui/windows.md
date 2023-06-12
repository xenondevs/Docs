## What is a Window in InvUI?

In InvUI, windows represent the actual Minecraft inventories that are displayed to the player.
Depending on the type of window, they display one or two GUI(s).

**A window can only have one viewer.** This is because InvUI's GUIs are designed to be easy to translate.
Up until this point, we've only dealt with `ItemProviders`, which unlike `ItemStacks` have a
method to retrieve the represented `ItemStack` with a `UUID` for translation purposes.  
Now, the window is the first part in the chain that uses `ItemStacks` - and as these are already
translated to a specific language, allowing multiple people to view the same window might cause
one of them to see the wrong language.

## List of Window types

| Name                      | Builder Factory Function            | Description                                                                                                                                              |
|---------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Normal Single Window      | `#!java Window.single()`            | The default chest / dropper / hopper inventory, chosen depending on the dimensions of the GUI. The player's inventory stays untouched.                   |
| Normal Merged Window      | `#!java Window.merged()`            | The default chest inventory and the player's inventory are filled by the same GUI.                                                                       |
| Normal Split Window       | `#!java Window.split()`             | The default chest / dropper / hopper inventory, chosen depending on the dimensions of the first GUI. The player's inventory is filled by the second GUI. |
| Anvil Single Window       | `#!java AnvilWindow.single()`       | An anvil inventory. The player's inventory stays untouched.                                                                                              |
| Anvil Split Window        | `#!java AnvilWindow.split()`        | The anvil inventory is filled by the first GUI. The player's inventory is filled by the second GUI.                                                      |
| Cartography Single Window | `#!java CartographyWindow.single()` | The inventory of the cartography table. The player's inventory stays untouched.                                                                          |
| Cartography Split Window  | `#!java CartographyWindow.split()`  | The inventory of the cartography table is filled by the first GUI. The player's inventory is filled by the second GUI.                                   |

Generally, there are three different categories of windows: single, split and merged.  
Single windows do not use the player's own inventory.  
Split windows use one GUI for the upper inventory and another GUI for the player's inventory (9x4).
Merged windows use the same GUI for the upper and lower inventory.

!!! note "When using merged or split windows:"

    * The contents of the player's inventory are saved and restored after the inventory has been closed
    * The player is not able to pick up any items
    * The player will not be able to trigger advancements

### AnvilWindow

The rename-text can be retrieved by calling `AnvilInventory#getRenameText()`. It is also possible to set one or multiple
`Consumer<String> renameHandler` in the `WindowBuilder`, which will then be called every time the rename-text is
changed.

### CartographyWindow

To update the map preview, you can use the methods `updateMap(MapPatch)`, `updateMap(List<MapIcon>)` and `resetMap()`.

Please note that the first slot of the cartography inventory is not accessible to you, as it is required to contain
a map item for the map preview to work. Therefore, your GUI's size has to be 2x1 instead of 3x1.

## Creating a new Window

To create a new `Window`, you'll need to use the `Window.Builder` for your desired window type which can be obtained
by calling the static builder factory function in the related `Window` interface. (See table above)

=== "Kotlin"

    ```kotlin
    val normalWindow = Window.single()
        .setViewer(player)
        .setGui(gui)
        .setTitle("InvUI")
        .build()

    val anvilWindow = AnvilWindow.split()
        .setViewer(player)
        .setUpperGui(anvilGui)
        .setLowerGui(playerGui)
        .setTitle("InvUI")
        .addRenameHandler { println(it) }
        .build()
    ```

=== "Java"

    ```java
    Window window = Window.single()
        .setViewer(player)
        .setGui(gui)
        .setTitle("InvUI")
        .build();

    AnvilWindow window = AnvilWindow.split()
        .setViewer(player)
        .setUpperGui(anvilGui)
        .setLowerGui(playerGui)
        .setTitle("InvUI")
        .addRenameHandler(s -> System.out.println(s))
        .build();
    ```

## Opening a Window

To show a `Window` to a player, you'll need to call `#!java Window.open();`.

=== "Kotlin"

    ```kotlin
    window.open()
    ```

=== "Java"

    ```java
    window.open();
    ```

As a shortcut, you can also directly call `.open(player)` on the `Window.Builder`.  
This will create a new `Window` and then directly show it to the specified player.

=== "Kotlin"

    ```kotlin
    Window.single()
        .setGui(gui)
        .setTitle("InvUI")
        .open(player)
    ```

=== "Java"

    ```java
    Window.single()
        .setGui(gui)
        .setTitle("InvUI")
        .open(player);
    ```

Alternatively, you can also call `.build(player)` on the `Window.Builder` to build a new `Window` for a specified player.

=== "Kotlin"

    ```kotlin
    val window = Window.single()
        .setGui(gui)
        .setTitle("InvUI")
        .build(player)

    window.open()
    ```

=== "Java"

    ```java
    Window window = Window.single()
        .setGui(gui)
        .setTitle("InvUI")
        .build(player);

    window.open();
    ```