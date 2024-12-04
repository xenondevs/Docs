## Creating a GuiTexture

To create a `GuiTexture`, you'll need to use a `GuiTextureRegistry`:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object GuiTextures : GuiTextureRegistry by ExampleAddon.registry {
    
    val EXAMPLE = guiTexture("example") {
         alignment(/*...*/) // (2)!
         path("gui/example")
    }
    
}
```

1. Nova will load this class during addon initialization, causing your gui textures to be registered.
2. The alignment of the texture. Depending on the inventory that your gui texture is intended for, and
   how the texture is intended to be displayed (left-aligned, centered, etc.) you can set the alignment accordingly.

## Using GuiTextures

In order to use a gui texture, call the `getTitle` method on it, and use the resulting title for a Gui.  
If you're making a [tile-entity menu](../tile-entity/gui.md), the `GuiTexture` can be set directly in its constructor.