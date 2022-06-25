# Registering Materials

## Time and Place of Registration
After [creating the item asset](../asset-packs/creating-items.md), they need to be registered in code.  
For this, we recommend creating a `Items` singleton object that contains all `ItemNovaMaterials` of your object.
All materials need to be registered when `Addon#init` is called, materials registered later might not work properly.

Your singleton object might then look like this:  
```kotlin
object Items {
    
    // we will register items here later
    
    fun init() = Unit
    
}
```
and your addon main like this:
```kotlin
object MyAddon : Addon() {
    
    override fun init() {
        Items.init()
    }
    
    override fun onEnable() = Unit
    override fun onDisable() = Unit
    
}
```
While the `init` function in `Items` is empty, calling it will still cause the class and all its fields to be loaded.

## Registering normal Items
All materials are registered via the `NovaMaterialRegistry`. To register a normal item without any behavior, you can use
the methods `registerItem` and `registerDefaultItem`. The only difference between those two methods is that
`registerDefaultItem` does not require a localized name, as it is automatically constructed in the format
`item.<namespace>.<name>`.

Registering our ruby from [before](../asset-packs/creating-items.md), our `Items` registry would look something like this:  
```kotlin
object Items {
    
    val RUBY = NovaMaterialRegistry.registerDefaultItem(MyAddon, "ruby")
    
    fun init() = Unit
    
}
```

## Registering food Items
However, we also previously mentioned that we want our ruby to be edible. For this, we need to call `registerFood`.
This also requires us to create food options, which configure things like eating time, nutrition, saturation, instant
health and more. You're also able to set custom code which will be executed when the food has been eaten.  
In this example, I'll use the nutrition and saturation values of an Apple, but with a eating time of 2 seconds:  
```kotlin
object Items {
    
    val RUBY = NovaMaterialRegistry.registerFood(
        Machines,
        "ruby",
        FoodOptions(
            consumeTime = 40, // 40 ticks = 2 second
            nutrition = 4,
            saturationModifier = 0.3f
        )
    )
    
    fun init() = Unit
    
}
```
The way nutrition and saturation is handle is exactly the same as it is in vanilla Minecraft.
This is the formula for calculating the resulting food level and saturation is the following:
```kotlin title="foodLevel"
min(player.foodLevel + options.nutrition, 20)
```
```kotlin title="saturation"
min(saturation + nutrition * saturationModifier * 2.0f, foodLevel)
```

!!! info

    You can find the `nutrition` and `saturationModifier` for vanilla Minecraft items by decompiling the mojang-mapped
    class `net.minecraft.world.food.Foods`.

## NovaItem
Custom behavior of items is done over so-called `NovaItems`. Every `ItemNovaMaterial` has a `NovaItem`, which is
basically just a list of [Item Behaviors](item-behaviors.md). When registering a material, you can either specify
the `NovaItem` or just pass the `ItemBehaviors`. If the `NovaItem` is set to `null`, the final `ItemNovaMaterial` will
still have a `NovaItem` with no item behaviors.