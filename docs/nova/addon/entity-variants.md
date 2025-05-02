## What is an Entity Variant?

Entity variants are a vanilla Minecraft feature and allow you to add retextured variants of existing entities to the game. 
([Minecraft Wiki](https://minecraft.wiki/w/Mob_variant))

## Registering a custom entity variant
You can register a custom entity variant like this:

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object EntityVariants  {
    
    val BLUE_COW by ExampleAddon.cowVariant("blue") {
        spawnConditions { 
            // (2)!
        }
        
        texture(CowModelType.WARM /*(3)!*/) {
            texture("entity/cow/blue")
        }
    }
    
}
```

1. Nova will load this class during addon initialization, causing your variants to be registered.
2. The conditions for your custom variant to be selected when spawning. See [Minecraft Wiki - Spawn Conditions](https://minecraft.wiki/w/Mob_spawning#Spawn_conditions)
 for more information.
3. Some entities offer multiple model types. For example, the warm cow has horns. You can select the model type here.