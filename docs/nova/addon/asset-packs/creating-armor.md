# Creating Armor
## Registering an Armor Texture

In order to register an armor texture, you'll first need to create a `armor.json` in `assets/`:  
![](https://i.imgur.com/G3gVSO7.png)

Then, create an armor entry:
```json
{
  "my_armor": {
    "layer_1": "", // (1)!
    "layer_2": "", // (2)!
    "layer_1_emissivity_map": "", // (3)!
    "layer_2_emissivity_map": "", // (4)!
    "interpolation": "", // (5)!
    "fps": 0 // (6)!
  }
}
```

1. The first layer of the armor texture.  
   This is the first layer of the diamond armor texture:  
   ![](https://i.imgur.com/dguEiQo.png)
2. The second layer of the armor texture.  
    This is the second layer of the diamond armor texture:  
    ![](https://i.imgur.com/F2ORgNQ.png)
3. (optional) The emissivity map of the first layer of the armor texture. Black pixels are interpreted as not emissive, white
   pixels are interpreted as fully emissive.
4. (optional) The emissivity map of the second layer of the armor texture. Black pixels are interpreted as not emissive, white
   pixels are interpreted as fully emissive.
5. (optional) The interpolation mode used for the case that this is an animated armor texture.
   Valid values are `none` and `linear`. This value is optional and defaults to `none`.
6. (optional) The frames per second of the animation, for the case that this is an animated armor texture.
   This value is optional and defaults to `0`.

## Higher Resolution Armor Textures

You can create armor textures of higher resolutions, as long as the aspect ratio is 2:1.  
If you do this, make sure that all layers (including emissivity maps) are of the same resolution.

## Animated Armor Textures

You can create animated armor textures by creating an animated texture, similar to how block and item textures are animated.
If you create an animated texture, make sure that the `interpolation` and `fps` properties are set and that all layers
(including emissivity maps) have the same number of frames.

## Compatibility with client-side rendering mods

### OptiFine
Custom armor can be rendered when using [OptiFine](https://optifine.net), however, the emissivity maps will not be used.  
The framerate of animated armor will be capped at 20 FPS.

### Iris
To use custom armor with [Iris](https://irisshaders.net/), it is required to install
[CITResewn](https://www.curseforge.com/minecraft/mc-mods/cit-resewn) for custom armor and
[Animatica](https://www.curseforge.com/minecraft/mc-mods/animatica) for animated armor textures
or similar mods that can read the OptiFine resource pack format.  
The emissivity maps will not be used. The framerate of animated armor will be capped at 20 FPS.