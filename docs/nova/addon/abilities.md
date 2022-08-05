# Abilities

## What are Abilities?

In Nova, abilities are ticking objects that can be assigned to players. They work similar to [attachments](attachments.md),
except that they have no logic by default.

## Creating your own Ability

To create your own ability, inherit from `Ability` and add your custom `handleRemoved` and `handleTick` logic.

```kotlin
class ExampleAbility(player: Player) : Ability(player) {
    
    override fun handleRemove() {
        // TODO
    }
    
    override fun handleTick() {
        // TODO
    }
    
}
```

Then, register a new ability type for that ability.  
We recommend creating a singleton object to store all ability types. These should be registered during Addon initialization.

```kotlin
object ExampleAddon : Addon() {
    
    override fun init() {
        Items.init()
        Blocks.init()
        Abilities.init()
    }
    
}
```

```kotlin
object Abilities {
    
    val EXAMPLE_ABILITY = AbilityTypeRegistry.register(ExampleAddon, "example_ability", ::MyAbility)
    
}
```

Then, give the ability to a player:

```kotlin
AbilityManager.giveAbility(player, Abilities.EXAMPLE_ABILITY)
```

And this is how you remove an ability:

```kotlin
AbilityManager.takeAbility(player, Abilities.EXAMPLE_ABILITY)
```