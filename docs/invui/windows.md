## What is a Window in InvUI?

In InvUI, windows represent the actual Minecraft inventories that are displayed to the player.
Depending on the type of window, they display on or two GUI(s).

**A window can only have one viewer.** This is because InvUI's GUIs are designed to be easy to translate.
Up until this point, we've only dealt with `ItemProviders`, which unlike `ItemStacks` have a
method to retrieve the represented `ItemStack` with a `UUID` for translation purposes.  
Now, the window is the first part in the chain that uses `ItemStacks` - and as these are already
translated to a specific language, allowing multiple people to view the same window might cause
one of them to see the wrong language.

## List of Window types

| Name                           | Description                                                                                                                                              |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `WindowType.NORMAL`            | The default chest / dropper / hopper inventory, chosen depending on the dimensions of the GUI. The player's inventory stays untouched.                   |
| `WindowType.NORMAL_MERGED`     | The default chest inventory and the player's inventory are filled by the same GUI.                                                                       |
| `WindowType.NORMAL_SPLIT`      | The default chest / dropper / hopper inventory, chosen depending on the dimensions of the first GUI. The player's inventory is filled by the second GUI. |
| `WindowType.ANVIL`             | An anvil inventory. The player's inventory stays untouched.                                                                                              |
| `WindowType.ANVIL_SPLIT`       | The anvil inventory is filled by the first GUI. The player's inventory is filled by the second GUI.                                                      |
| `WindowType.CARTOGRAPHY`       | The inventory of the cartography table. The player's inventory stays untouched.                                                                          |
| `WindowType.CARTOGRAPHY_SPLIT` | The inventory of the cartography table is filled by the first GUI. The player's inventory is filled by the second GUI.                                   |

Generally, there are three different categories of windows: single, split and merged.  
Single windows do not use the player's own inventory.  
Split windows use one GUI for the upper inventory and another GUI for the player's inventory.
Merged windows use the same GUI for the upper and lower inventory.

While the player's inventory in use by a window, the contents are saved and restored after
the inventory has been closed or the player dies.
Additionally, the player is not able to pick up any items and advancement listening is also
temporarily turned off. Therefore, the feature is safe to use in survival mode.

### AnvilWindow

The rename-text can be retrieved by calling `AnvilInventory#getRenameText()`. It is also possible to set one or multiple 
`Consumer<String> renameHandler` in the `WindowBuilder`, which will then be called every time the rename-text is changed.

### CartographyWindow

To update the map preview, you can use the methods `updateMap(MapPatch)`, `updateMap(List<MapIcon>)` and `resetMap()`.

Please note that the first slot of the cartography inventory is not accessible to you, as it is required to contain
a map item for the map preview to work. Therefore, your GUI's size has to be 2x1 instead of 3x1.

## Creating a new Window

To create a new `Window`, you'll need to use the `WindowBuilder` for your desired window type which can
be obtained by calling `WindowType.builder()`.

=== "Kotlin"

    ```kotlin
    val normalWindow = WindowType.NORMAL.builder()
        .setViewer(player)
        .setGui(gui)
        .setTitle("InvUI")
        .build()

    val anvilWindow = WindowType.ANVIL_SPLIT.builder()
        .setViewer(player)
        .setUpperGui(anvilGui)
        .setLowerGui(playerGui)
        .setTitle("InvUI")
        .addRenameHandler { println(it) }
        .build()
    ```

=== "Java"

    ```java
    Window window = WindowType.NORMAL.builder()
        .setViewer(player)
        .setGui(gui)
        .setTitle("InvUI")
        .build();

    AnvilWindow window = WindowType.ANVIL_SPLIT.builder()
        .setViewer(player)
        .setUpperGui(anvilGui)
        .setLowerGui(playerGui)
        .setTitle("InvUI")
        .addRenameHandler(s -> System.out.println(s))
        .build();
    ```