## Creating armor

Custom armor can be registered via an `ArmorRegistry`:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Armor : ArmorRegistry by ExampleAddon.registry {
    
    val EXAMPLE = armor("example") {
        texture {
            texture(layer1 = "armor/example_layer_1", layer2 = "armor/example_layer_2") // (2)!
            emissivityMap(layer1 = "armor/example_layer_1_emissivity_map", layer2 = "armor/example_layer_2_emissivity_map") // (3)!
            animated(fps = 20.0, InterpolationMode.LINEAR) // (4)!
        }
    }

}
```

1. Nova will load this class during addon initialization, causing your armor to be registered.
2. The texture of any armor consists of two layers.  
   This is the first layer of the diamond armor texture:  
   ![](https://i.imgur.com/dguEiQo.png)
   This is the second layer of the diamond armor texture:  
   ![](https://i.imgur.com/F2ORgNQ.png)
3. (optional) The emissivity maps of the armor texture. Black pixels are interpreted as not emissive, white
   pixels are interpreted as fully emissive.
4. (optional) The animation settings in case this is an animated armor texture.

After creating the armor, you can apply it to items using the `Wearable` behavior:

```kotlin
val EXAMPLE_HELMET = registerItem("example_helmet", Werable(Armor.EXAMPLE, EquipmentSlot.HEAD))
```

### Higher Resolution Armor Textures

You can create armor textures of higher resolutions, as long as the aspect ratio is 2:1.  
If you do this, make sure that all layers (including emissivity maps) are of the same resolution.

### Animated Armor Textures

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