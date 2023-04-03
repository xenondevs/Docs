## Working with Bukkit Events

Of course, you can also use Bukkit's events. To register an event listener, use the `Listener.registerListener()` extension function.

## Calling events from Nova's Plugin API

You might've noticed that the `nova-api` module is not in your classpath. This module is explicitly for developers of
third party plugins and provides a stable API for Nova. To prevent addon developers from accidentally using those
classes, `nova-api` is not a transitive dependency of `nova`.

To still call events from Nova's Plugin API, use the `NovaEventFactory`:

```kotlin
// obtain drops from the block
val drops: MutableList<ItemStack> = block.getAllDrops().toMutableList()
// call the event (might mutate drops list)
NovaEventFactory.callTileEntityBlockBreakEvent(this, block, drops)
```