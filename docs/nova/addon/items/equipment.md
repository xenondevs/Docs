## Creating equipment

Custom equipment (armor) can be registered like this:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Equipment {
    
   val EXAMPLE = ExampleAddon.equipment("example") {
      humanoid  { // (2)!
         layer { // (3)!
            texture("example") // (4)!
            dyeable(Color.WHITE) // (6)!
         }
      }
   
      humanoidLeggings {
         layer {
            texture("example") // (5)!
         }
      }
   }

}
```

1. Nova will load this class during addon initialization, causing your armor to be registered.
2. The type of equipment. You can also create equipment for horses, dogs, and more.
3. You can layer multiple textures on top of each other. This layering is flat, there is no three-dimensional effect
   like for the player skin.
4. The path to the texture. This resolves the file under `textures/entity/equipment/humanoid/example.png`
5. The path to the texture. This resolves the file under `textures/entity/equipment/humanoid/example.png`
6. (optional) Makes this layer dyeable and uses `Color.WHITE` if no dye is applied.
   Dyeable items also require the `Dyeable` item behavior.

After creating the armor, you can apply it to items using the `Equippable` behavior:

```kotlin
val EXAMPLE_HELMET = registerItem("example_helmet", Equippable(Armor.EXAMPLE, EquipmentSlot.HEAD))
```

## Animated equipment

You can also create animated armor:

```kotlin title="Equipment.kt"
val EXAMPLE = ExampleAddon.animatedEquipment("example") {
   humanoid  {
      layer {
          texture(5, InterpolationMode.NONE, "frame_1", "frame_2", "frame_3") // (1)!
      }
   }
   
   /* ... */
}
```

1. Creates a non-interpolated animation that switches through the three defined frames every 5 ticks.
   Note that interpolation is achieved by pre-generating all interpolated frames, which may drastically
   increase resource pack size.