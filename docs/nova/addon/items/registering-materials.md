# Registering Materials

## Time and Place of Registration
After [creating the item asset](../asset-packs/creating-items.md), they need to be registered in code.  
For this, we recommend creating a `Items` singleton object that contains all `ItemNovaMaterials` of your addon.
All materials need to be registered when `Addon#init` is called, materials registered later won't work properly.

Your singleton object might then look like this:  
```kotlin
object Items {
    
    // we will register items here later
    
    fun init() = Unit
    
}
```
and your addon main like this:
```kotlin
object ExampleAddon : Addon() {
    
    override fun init() {
        Items.init()
    }
    
}
```
While the `init` function in `Items` is empty, calling it will still cause the class and all its fields to be loaded.

## Registering Items
All materials are registered via the `NovaMaterialRegistry`. In most cases, you'll want to call the `registerItem` method.  
If you don't want your item to have a name, you can use the `registerUnnamedItem` method. If you don't want it to pop up
in `/nova give`, register it with `registerUnnamedHiddenItem`. This can be useful when registering GUI items.

Registering our ruby from [before](../asset-packs/creating-items.md), our `Items` registry would look like this:  
```kotlin
object Items {
    
    val RUBY = NovaMaterialRegistry.registerItem(ExampleAddon, "ruby")
    
    fun init() = Unit
    
}
```