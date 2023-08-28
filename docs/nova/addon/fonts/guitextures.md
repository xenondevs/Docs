# GUI Textures

The GUITextures [registered previously](asset-packs/creating-guis.md) can simply be accessed by calling  
```kotlin
val EXAMPLE_GUI = GuiTexture.of(ExampleAddon, "example_gui")
```
you might then want to store them in a singleton object `GuiTexture`, similar to [blocks](blocks/registering-blocks.md)
and [items](items/registering-items.md).  

In order to use a gui texture, call the `getTitle` method on it, and use the resulting title for a Gui.  
If you're making a `TileEntityGui`, the `GuiTexture` can be directly set in its constructor.