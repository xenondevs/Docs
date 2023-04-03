## Hitbox Implementations

Nova provides you with two built-in ways to handle left- and right-click detection in game.

### PhysicalHitbox

A `PhysicalHitbox` uses an [Interaction Entity](https://minecraft.fandom.com/wiki/Interaction).
This means that the hitbox can be shown by pressing `F3+B` and functions similar to a normal entity, with it
not allowing to interact with anything behind it.
`PhysicalHitboxes` are also restricted to a square base area, as they only have a `width` and a `height`.

```kotlin
// create the hitbox
val hitbox = PhysicalHitbox(center, width, height)
// add click handlers
hitbox.addLeftClickHandler { /* ... */ }
hitbox.addRightClickHandler { /* ... */ }
// spawn the hitbox
hitbox.register()
// despawn the hitbox
hitbox.unregister()
```

### VirtualHitbox

`VirtualHitboxes` use server-side path tracing, which has a bigger performance impact than `PhysicalHitboxes`, but
allows for more complex and flexible hitboxes. For one, their size is completely customizable, and they're not limited
to a square base area. Additionally, you can also specify a `qualifier` function, which allows you to filter out
certain cases where the hitbox should not be triggered and the player should be able to interact with the block behind it.

You can show all virtual hitboxes using the command `/nova debug showHitboxes`.

```kotlin
// create the hitbox
val hitbox = VirtualHitbox(from, to)
// set the qualifier function
hitbox.setQualifier { /* ... */ }
// add click handlers
hitbox.addLeftClickHandler { /* ... */ }
hitbox.addRightClickHandler { /* ... */ }
// spawn the hitbox
hitbox.register()
// despawn the hitbox
hitbox.unregister()
```

## Hit Location

When a player clicks a hitbox, you might be supplied with a `Vector3f location` parameter. This location is relative
to the center of the base area of the hitbox. To determine the block face that was clicked, you can use the 
`Hitbox.determineBlockFace(location: Vector3f)` function.

!!! info

    Whether or not you're supplied with a `location` parameter depends on the click type and hitbox implementation.
    For physical hitboxes, only right-clicks will supply you with a location, while for virtual hitboxes, both left-
    and right-clicks will supply you with a location.