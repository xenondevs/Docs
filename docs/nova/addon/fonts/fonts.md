# Fonts

## Importance of custom fonts

Custom fonts play an important role in server-side modding, because they allow you to display your textures basically
anywhere on the screen. They allow you to create custom hud elements, gui textures, and much more.

## Font format

To properly use features based on custom fonts, it's important to understand fonts in Minecraft work.  

In vanilla Minecraft, you can create custom fonts with resource packs.  
Those fonts are json files located under `assets/<namespace>/font/` with the following structure:

```json title="assets/namespace/font/my_font.json"
{
  "providers": [ // (1)!
    {
      "type": "" // (2)!
      ... // (3)!
    },
    ... // (4)!
  ]
}
```

1. An array of providers. The amount of font providers a font can have is unlimited.
   A provider itself can provide as many characters as you want it to.
2. The type of the font provider. Possible options: `bitmap`, `unihex`, `ttf`, `space` (see below)
3. Additional keys to configure the font provider
4. Additional providers

| Provider type | Description                                                                                                                          | Importance      | Usage (in Nova and addons)                                                      |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------|:----------------|:--------------------------------------------------------------------------------|
| `bitmap`      | Characters are read from a `png` file.                                                                                               | High            | Allows you to create custom hud elements and gui textures like described above. |
| `space`       | Defines space widths.                                                                                                                | High            | Allows negative spaces[^1] and sub-gui-scale movements[^2] of characters.       |
| `unihex`      | Characters are stored in a text-based format, where each line is a hexadecimal string representing a binary black and white texture. | Low             | Unimportant for addon developers                                                |
| `ttf`         | Reads characters from a `ttf` or `otf` file.                                                                                         | Unsupported[^3] | None                                                                            |

[^1]: Negative spaces are required to move the "cursor" to the left before/after drawing a custom character.
They allow you to draw over previous characters, which makes it possible to have, for example, a background behind
text or generally more complex hud elements. They're also often required to move the texture you're trying
to draw to its correct position.
[^2]: Minecraft fonts are pixel-based. On gui-scale 1, one pixel in your character corresponds to one pixel rendered on the
screen. On higher gui scales, the characters are scaled accordingly. (gui-scale 2: 2x2, gui-scale 3: 3x3, etc.)  
Obviously, spaces need to scale accordingly. However, this creates the issue that one could only move textures at
2px intervals on gui-scale 2, or 3px intervals on gui-scale 3, etc. But with the `space` provider, it is possible
to define spaces as floats like `0.5` or `0.25`, which allows a more precise positioning of your custom textures.
[^3]: This provider is not used by Mojang and is not supported by any of Nova's features such as char size calculation,
bitmap font generation, or in-code generated fonts.

_More information about the font file format can be found on the [Minecraft wiki](https://minecraft.fandom.com/wiki/Resource_pack#Fonts)._

## Custom fonts in Nova

### Creating custom fonts

In Nova, you can either:

* Add font files to your asset pack under `fonts/` using the vanilla font format.
* Generate font files during resource pack generation using [FontContent](../resourcepack/build-logic.md#fontcontent).

### Using custom fonts

Using adventure components, you can easily change the font of any text:

```kotlin
Component.text("A").font("my_font")
```

### Horizontal movement

Nova also has built-in (negative) spaces in the `minecraft:default` font, so you will not have to implement those yourself.  
To generate a movement string, you can use `#!kotlin MoveCharacters.getMovingString(distance)` or directly get a  component
using `#!kotlin MoveCharacters.getMovingComponent(distance)`.

To calculate the width of a component, use `#!kotlin CharSizes.calculateComponentWidth(component, lang)` or get even more
information using `#!kotlin CharSizes.calculateComponentSize(component, lang)`.

Nova also provides some useful extension functions to make all of this easier:

| Extension function                                   | Description                                                                                                                                                                                               |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `#!kotlin ComponentBuilder.move(distance)`           | Appends move characters of the given distance.                                                                                                                                                            |
| `#!kotlin ComponentBuilder.moveToStart(lang)`        | Appends move characters that match the negative width of the current text, essentially moving the "cursor" back to where it started.                                                                      |
| `#!kotlin ComponentBuilder.moveToCenter(lang)`       | Appends move characters that match half of the negative width of the current text, essentially moving the "cursor" to the middle of the text.                                                             |
| `#!kotlin ComponentBuilder.moveTo(afterStart, lang)` | Appends move characters that match the negative width of the current text plus the `afterStart` value, essentially moving the "cursor" by the given distance after the point where it originally started. |

### Vertical movement

Moving text along the vertical axis is a bit more difficult to achieve. Currently, the only way to do this in Nova is to
generate vertically moved variations of a font. To do that, request those variations during the resource pack build
process using [MovedFontContent](../resourcepack/build-logic.md#movedfontcontent).

```kotlin
builder.getHolder<MovedFontContent>().requestMovedFonts(ResourcePath("namespace", "name"), 0..19)
```

During runtime, you can then create a vertically moved component using `#!kotlin MovedFonts.moveVertically(component, distance)`.

!!! faq "How are vertically moved fonts generated?"

    The `bitmap` provider has an `ascent` property. The generated variations will add to this property, so a font
    that is moved down by 1px will add -1 to the existing ascent value. The new fonts are named `<original_namespace>/<original_name>/<offset>`,
    so for example `minecraft:default/1` or `example_addon:my_font/2`.  
    Unihex providers do not have such a property, so they're converted to bitmap providers first.