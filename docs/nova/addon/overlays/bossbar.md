Boss bar overlays are generally similar to action bar overlays, with the difference that they're rendered at boss bar
position, can be moved vertically, and have a built-in way to dynamically position themselves above/below other overlays.

## Vertically Moved Fonts
Boss bars in Minecraft generally have a fixed spacing of 19px. However, we need to be able to move overlays at 1px increments,
which is why Nova gets rid of all vanilla boss bars and re-renders them using custom characters that have a boss bar texture.
Additionally, we also create what we call "vertically moved fonts", which are variations of a font that are moved on the
vertical axis.

When creating a font for a boss bar overlay, you will also need to create those vertically moved font variations.  
For that, create a file called `moved_fonts.json` in your `assets` directory:

```json title="moved_fonts.json"
{
  "exampleaddon:myfont": {
    "range": [1, 19] // (1)!
  }
}
```

1. Specifies the range of vertically moved fonts to generate. For boss bar overlays, it is required to generate vertically
   moved fonts from 1 to 19 with 1px increments, as this is the spacing between the actual boss bars.

??? tip "Optional: Using vertically moved fonts in code"

      For boss bar overlays, you will not need to access or use your vertically moved fonts at any time, as Nova will automatically
      apply to correct font based on your overlay's offset and positioning. However, you can still use them in your code if you
      need them for other reasons. Vertically moved fonts are generated to `exampleaddon:myfont/1`, `exampleaddon:myfont/2`, etc. and
      you can also automatically apply them to a `Component` using `MovedFonts.moveVertically`.

!!! info "Vertically moved fonts for `minecraft:default` are already included in Nova."

After you've created your vertically moved fonts, you can start implementing the boss bar overlay in code.
For that, you'll need to create a `BossBarOverlayCompound` consisting of at least one `BossBarOverlay`.

## BossBarOverlay
Each `BossBarOverlay` defines a `Component` to be rendered at one specific vertical position.

| property  | description                                                                                                                                                |
|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| offset    | The vertical offset of this `BossBarOverlay` inside the `BossBarOverlayCompound`.                                                                          |
| centerX   | The x coordinate at which the component should be centered at, with 0 being the middle of the screen. Can be null if no centering logic should be applied. |
| component | The component to display.                                                                                                                                  |

Similar to action bar overlays, you can override the `getWidth` and also the `getVerticalRange` methods to improve performance.

## BossBarOverlayCompound
A `BossBarOverlayCompound` is a collection of `BossBarOverlays`. The overlays in this compound will never be seperated.

| property    | description                                                                                                                                                                                                           |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| overlays    | The list of `BossBarOverlays` that are part of the `BossBarOverlayCompound`.                                                                                                                                          |
| positioning | The `BarPositioning` that specifies at which position the `BossBarOverlayCompound` should be rendered.                                                                                                                |
| hasChanged  | Whether any component of the included overlays have been changed and should be re-rendered. If you set this boolean to true, the `BossBarOverlayManager` will update your overlay and set the boolean to false again. |

The `BossBarOverlayCompound` can then be registered:
```kotlin
BossBarOverlayManager.registerOverlay(player, compound)
BossBarOverlayManager.unregisterOverlay(player, compound)
```

### BarPositioning
The `BarPositioning` determines where your overlay should be rendered. You can choose between `BarPositioning.Fixed` and
`BarPositioning.Dynamic`, where the latter will automatically move your overlay to prevent it from overlapping with other
overlays or vanilla boss bars. Both types of positioning also allow you to define `BarMatchers`, which are used to determine
whether your overlay should be placed above or below another overlay.  
`BarMatchers` can be both hard-coded or deserialized from a yaml configuration using `ConfigurationSection.getDeserialized<BarMatcher>(path)`.
See [Configuration - WAILA Positioning](../../admin/configuration.md#waila-positioning) for a more detailed explanation.