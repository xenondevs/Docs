!!! tip

    In order to understand Nova's overlays, it might be beneficial for you to read our
    [spigot thread on using the font renderer](https://www.spigotmc.org/threads/520187/).

Overlays follow the same concept of using fonts to render images as [GUI Textures](../guitexture.md), but are
a bit more difficult to implement for addon developers, as you need to create the font file yourself.

Font files are stored under `assets/fonts/` and have [this format](https://minecraft.fandom.com/wiki/Resource_Pack#Fonts).  
You might also want to take a look at [our font for the jetpack energy bar overlay](https://github.com/Nova-Addons/Jetpacks/blob/main/src/main/resources/assets/fonts/energy_bar.json).

## ActionBarOverlay

After creating your font, implement the `ActionbarOverlay` interface. There you'll need to provide the component
to be displayed in the action bar. To improve performance, you can also override the `getWidth` function which should
return the width of the overlay in pixels. Otherwise, this width will be calculated at runtime.

??? example "Example: JetpackOverlay"

    ```kotlin
    class JetpackOverlay : ActionbarOverlay {

    override var component: Component = getCurrentComponent()
        private set
    
    var percentage: Double = 0.0
        set(value) {
            require(value in 0.0..1.0)
            if (field == value)
                return
            
            field = value
            component = getCurrentComponent()
        }
    
    private fun getCurrentComponent(): Component {
        val stage = (percentage * 38).toInt()
        
        return Component.text()
            .move(95) // moves the cursor position to the right by 95 pixels
            .append(Component.text(('\uF000'.code + stage).toChar().toString()).font("jetpacks:energy_bar"))
            .build()
    }
    ```

The overlay can now be displayed through the `ActionbarOverlayManager`:

```kotlin
ActionbarOverlayManager.registerOverlay(player, overlay)
```

!!! info

    Nova intercepts action bar packets and appends the action bar overlay to it.  
    This means that normal action bar text can still be displayed, even if one or more action bar overlays are active.