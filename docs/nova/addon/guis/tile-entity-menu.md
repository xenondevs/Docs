---
icon: lucide/panel-top
---

# Tile Entity Menu

!!! tip "Nova uses InvUI for GUIs. Check out InvUI's documentation [here](../../../../invui/)."

Nova's `TileEntity` class has a `#!kotlin menu: TileEntityMenu` property which is used to manage this windows associated with the tile entity. Simply override it to add a GUI to your tile entity:

```kotlin
override val menu = TileEntityMenu.cachedWindow(GuiTextures.EXAMPLE_GUI_TEXTURE) { // (1)!
    // (2)!
    upperGui by /* ... */
}
```

1. `#!kotlin TileEntityMenu.cachedWindow` is recommended. The `TileEntityMenu` will remember the opened window, which prevents unnecessary re-creation and also prevents gui state (e.g. for `PagedGui`) from being forgotten immediately on close. You can, however, also use `#!kotlin TileEntityMenu.window` for an uncached window.

    Additionally, you can also specify the type of `WindowDsl` to use, for example if you want to use an `AnvilWindow` instead.

2. This is a standard `WindowDsl.() -> Unit` block (like `window(player)`). Each player will get their own `Window`.

Make sure that you have the `TileEntityInteractive` block behavior applied, otherwise the tile entity will not receive the click action and no menu will be opened.

## Tracking additional Windows

The `TileEntityMenu` needs to be made aware of any additional windows, so that it can close them when the tile entity is destroyed or when the viewer moves out of range. You can do this by calling `#!kotlin TileEntityMenu.register(Window)`.

??? example "Example button that opens and tracks a sub menu"

      The following function creates a UI item that lazily creates, tracks, and opens a sub-menu when clicked.

      ```kotlin
      context(tileEntity: TileEntity, windowDsl: WindowDsl) // (1)!
      fun openSubWindow(): Item = item {
          itemProvider by GuiItems.OPEN_EXAMPLE_WINDOW_BTN
          
          val exampleWindow by lazy {
              val window = createExampleWindow(windowDsl.viewer, windowDsl.window) // (2)!
              tileEntity.menu.register(window) // (3)!
              window
          }
          
          onClick {
              exampleWindow.open()
          }
      }
      ```

      1. Using context parameters to implicitly pass things like the `TileEntity` and `WindowDsl` makes using this function much less verbose.
      2. When creating your window, you can then use the `WindowDsl` context parameter for things like the viewer and the parent window. The parent window is useful if you want to have a "back" button.
      3. Tracks the window as part of the TileEntity's menu. `TileEntityMenu` only keeps a `WeakReference`, so this will not cause memory leaks.
