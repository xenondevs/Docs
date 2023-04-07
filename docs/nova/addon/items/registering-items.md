## Creating an Item Registry
After [creating the item asset](../asset-packs/creating-items.md), they need to be registered in code.  
To do this, you will need to create a registry for your items. This can be done by creating a singleton object that implements
`ItemRegistry`. In order to not need to implement the `getAddon` method, you can delegate to `ExampleAddon.registry`.
All items need to be registered during initialization, so you can either load the class from the `init` block of your
addon or annotate your registry with `#!kotlin @Init`.

Your singleton object might then look like this:  
```kotlin
@Init // (1)! 
object Items ItemRegistry by ExampleAddon.registry {
    
    // (2)!
    
}
```

1. Nova will load this class during addon initialization, causing your items to be registered.
2. Register your items here

## Registering Items
Using the existing methods in `ItemRegistry`, you can now register your items.
For that, you can choose between the builder pattern accessed via `item(id)` or use the `register...` methods.

If you don't want your item to have a name, you can use the `registerUnnamedItem` method.  
If you don't want it to pop up in `/nova give`, register it with `registerUnnamedHiddenItem`. This can be useful when registering GUI items.

!!! bug "When using the builder pattern, you will need to call `register` at the end of your chain."

Registering our ruby from [before](../asset-packs/creating-items.md), your `Items` registry would look like this:  
```kotlin
@Init // (1)!
object Items : ItemRegistry by ExampleAddon.registry {
    
    val RUBY = registerItem("ruby")
    
}
```

1. Nova will load this class during addon initialization, causing the `RUBY` field to be initialized and your item to be registered.