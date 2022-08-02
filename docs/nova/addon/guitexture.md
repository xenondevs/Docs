# GUI Textures / Overlays

!!! tip
    
    In order to understand Nova's GUI textures and overlays, it might be beneficial for you to read our
    [spigot thread on abusing custom fonts](https://www.spigotmc.org/threads/520187/).

# GUI Textures

The GUITextures [registered previously](asset-packs/creating-guis.md) can simply be accessed by calling  
```kotlin
val EXAMPLE_GUI = GUITexture.of(ExampleAddon, "example_gui")
```
you might then want to store them in a singleton object `GUITexture`, similar to [blocks](blocks/registering-materials.md)
and [items](items/registering-materials.md).  

In order to use a gui texture, call the `getTitle` method on it, and use the resulting title for a GUI.  
If you're making a `TileEntityGUI`, the `GUITexture` can be directly set in its constructor.

# Action bar overlays

Action bar overlays follow the same concept of abusing fonts to render images, but are a bit more difficult to implement
for addon developers, as it requires them to create the font file themselves.  

Font files are stored under `assets/fonts/` and have [this format](https://minecraft.fandom.com/wiki/Resource_Pack#Fonts).  
You might also want to take a look at [our font for the jetpack energy bar overlay](https://github.com/Nova-Addons/Jetpacks/blob/main/src/main/resources/assets/fonts/energy_bar.json).

After creating your font, implement the `ActionbarOverlay` interface. There you'll need to provide the component array
to be displayed in the action bar, as well as the width of the entire text. Components to move the text by a specified
amount of pixels can be obtained by calling `MoveCharacters#getMovingComponent`.

!!! question "Why is the width important?"

    As you might know, Minecraft always centers the text in the action bar. In order to prevent this, Nova automatically
    moves the "cursor" back to the middle by appending negative movement characters, which makes the game think that the
    actual width of the text is 0, therefore leaving it where it is.

??? example "JetpackOverlay"

    ```kotlin
    class JetpackOverlay : ActionbarOverlay {
    
        override var text: Array<BaseComponent> = getCurrentText()
            private set
        
        // 95 is the moved distance, 23 is texture size + 1 (1)
        override val width = 95 + 23
        
        var percentage: Double = 0.0
            set(value) {
                require(value in 0.0..1.0)
                if (field == value) return
                field = value
                text = getCurrentText()
            }
        
        private fun getCurrentText(): Array<BaseComponent> {
            val stage = (percentage * 38).toInt()
            
            return ComponentBuilder()
                .append(MoveCharacters.getMovingComponent(95))
                .append(('\uF000'.code + stage).toChar().toString())
                .font("jetpacks:energy_bar")
                .create()
        }
    
    }
    ```
    
    1. + 1 because the "cursor" always moves one pixel to the left after every character in order to make space between them.

The overlay can now be displayed through the `ActionbarOverlayManager`:

```kotlin
ActionbarOverlayManager.registerOverlay(player, overlay)
```

!!! info

    Nova intercepts action bar packets and appends the action bar overlay to it. This means that normal action bar text
    can still be displayed, even if one or more action bar overlays are active.