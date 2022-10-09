# Overlays

!!! tip

    In order to understand Nova's overlays, it might be beneficial for you to read our
    [spigot thread on using the font renderer](https://www.spigotmc.org/threads/520187/).

Overlays follow the same concept of using fonts to render images as [GUI Textures](guitexture.md), but are
a bit more difficult to implement for addon developers, as you need to create the font file yourself.

Font files are stored under `assets/fonts/` and have [this format](https://minecraft.fandom.com/wiki/Resource_Pack#Fonts).  
You might also want to take a look at [our font for the jetpack energy bar overlay](https://github.com/Nova-Addons/Jetpacks/blob/main/src/main/resources/assets/fonts/energy_bar.json).

## Action bar overlay

After creating your font, implement the `ActionbarOverlay` interface. There you'll need to provide the component array
to be displayed in the action bar, as well as the width of the entire text. Components to move the text by a specified
amount of pixels can be obtained by calling `MoveCharacters#getMovingComponent`.

??? question "Why is the width important?"

    As you might know, Minecraft always centers the text in the action bar. In order to prevent this, Nova automatically
    moves the "cursor" back to the middle by appending negative movement characters, which makes the game think that the
    actual width of the text is 0, therefore leaving it where it is.

??? example "Example: JetpackOverlay"

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
    
    1. +1 because the "cursor" always moves one pixel to the left after every character in order to make space between them.

The overlay can now be displayed through the `ActionbarOverlayManager`:

```kotlin
ActionbarOverlayManager.registerOverlay(player, overlay)
```

!!! info

    Nova intercepts action bar packets and appends the action bar overlay to it.  
    This means that normal action bar text can still be displayed, even if one or more action bar overlays are active.

## Boss bar overlay

Similar to the action bar overlay, you can also render at boss bar position. For that, you can either extend the
`BossBarOverlay` class or use the `TextBossBarOverlay` and `CenteredTextBossBarOverlay` implementations if you just
need to render text.

Then, register your overlay in the `BossBarOverlayManager`:

```kotlin
BossBarOverlayManager.registerOverlay(player, overlay)
```

!!! info

    Nova intercepts all vanilla boss bars and then redraws them using custom characters that have the boss bar texture.  
    With this approach, vanilla boss bars are just moved below your boss bar overlay.