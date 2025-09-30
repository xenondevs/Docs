## Creating a GuiTexture

Register your gui texture during initialization:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object GuiTextures {
    
    val EXAMPLE = ExampleAddon.guiTexture("example") {
        alignment(/*...*/) // (2)!
        path("gui/example") // (3)!
        inventoryLabel(true) // (4)!
    }

}
```

1. Nova will load this class during addon initialization, causing your gui textures to be registered.
2. The alignment of the texture. Depending on the menu type (e.g. anvil or chest) that your gui texture is intended for, and how the texture is intended to be displayed (left-aligned, centered, etc.) you can set the alignment accordingly.
3. The path to the texture, in this case, `assets/textures/gui/example.png`. This texture should encompass both the upper and lower inventory. For most menu types, gui textures can also be transparent.
4. Whether the "Inventory" label should be displayed above the player's inventory. Defaults to `true`.

## Using GuiTextures

In order to use a gui texture, call the `getTitle` method on it, and use the resulting title for a Gui. If you're creating a [tile-entity menu](../tile-entity/gui.md), the `GuiTexture` can be set directly in its constructor.