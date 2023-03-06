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

| Name                   | Description                                                                                                                                              |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| SimpleWindow           | The default chest / dropper / hopper inventory, chosen depending on the dimensions of the GUI. The player's inventory stays untouched.                   |
| AnvilWindow            | An anvil inventory. The player's inventory stays untouched.                                                                                              |
| CartographyWindow      | The inventory of the cartography table. The player's inventory stays untouched.                                                                          |
| SimpleSplitWindow      | The default chest / dropper / hopper inventory, chosen depending on the dimensions of the first GUI. The player's inventory is filled by the second GUI. |
| AnvilSplitWindow       | The anvil inventory is filled by the first GUI. The player's inventory is filled by the second GUI.                                                      |
| CartographySplitWindow | The inventory of the cartography table is filled by the first GUI. The player's inventory is filled by the second GUI.                                   |
| SimpleCombinedWindow   | The default chest inventory and the player's inventory are filled by the same GUI.                                                                       |

Generally, there are three different categories of windows: single, split and combined.  
Single windows do not use the player's own inventory.  
Split windows use one GUI for the upper inventory and another GUI for the player's inventory.
Combined windows use the same GUI for the upper and lower inventory.

While the player's inventory in use by a window, the contents are saved and restored after
the inventory has been closed or the player dies.
Additionally, the player is not able to pick up any items and advancement listening is also
temporarily turned off. Therefore, the feature is safe to use in survival mode.

### Anvil Window

In both `AnvilWindow` and `AnvilSplitWindow`, the rename-text can be retrieved either using
the `Consumer<String> renameHandler` provided in the constructor or with `getRenameText()`.

### Cartography Window

You're also able to set the map preview in both `CartographyWindow` and `CartographySplitWindow`.
To do this, you can use the methods `updateMap(MapPatch)`, `updateMap(List<MapIcon>)` and `resetMap()`.

Note: The first slot of the cartography inventory is not accessible to you, as it is required to contain
a map item for the map preview to work. Therefore, your GUI's size has to be 2x1 instead of 3x1.
