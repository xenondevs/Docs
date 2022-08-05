# GUI Textures

!!! tip
    
    In order to understand Nova's GUI textures and overlays, it might be beneficial for you to read our
    [spigot thread on using the font renderer to render guis](https://www.spigotmc.org/threads/520187/).

The GUITextures [registered previously](asset-packs/creating-guis.md) can simply be accessed by calling  
```kotlin
val EXAMPLE_GUI = GUITexture.of(ExampleAddon, "example_gui")
```
you might then want to store them in a singleton object `GUITexture`, similar to [blocks](blocks/registering-materials.md)
and [items](items/registering-materials.md).  

In order to use a gui texture, call the `getTitle` method on it, and use the resulting title for a GUI.  
If you're making a `TileEntityGUI`, the `GUITexture` can be directly set in its constructor.