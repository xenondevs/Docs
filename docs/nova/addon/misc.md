## Initialization

Nova provides you with the aforementioned `#!kotlin @Init` annotation. Simply annotate your class with it and Nova will load it during
the initialization phase of your addon. You can also specify dependencies which will be loaded before your class.

If your class is annotated with `#!kotlin @Init`, you can also annotate your functions with `#!kotlin @InitFun` and `#!kotlin @DisableFun`:

* `#!kotlin @InitFun`: Specify one or more functions that should be called during initialization.
* `#!kotlin @DisableFun` Specify one or more functions that should be called when your addon is disabled. These functions are called
  in reverse dependency order.

## Working with Bukkit Events

Of course, you can also use Bukkit's events. To register an event listener, use the `Listener.registerListener()` extension function.

## Working with Packet Events

You can also listen to incoming and outgoing packets. To do so, register your class as a packet listener using the `Any.registerPacketHandler()`
extension function. Then, you can use the `@PacketHandler` annotation to mark event methods.

!!! abstract "Packet Event Types"

    The packet event system is part of [NMS-Utilities](https://github.com/xenondevs/NMS-Utilities/). A list of all possible
    event types can be found [here](https://github.com/xenondevs/NMS-Utilities/tree/main/src/main/kotlin/xyz/xenondevs/nmsutils/network/event).  
    Please note that this currently does not include all possible packets, as the system is still in development.
    Feel free to open a pull request if you need another packet type.

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

## Configuring project distributors for update notifications

To set up update notifications, simply override the `projectDistributors` list in your addon object:

```kotlin title="MyAddon.kt"
object MyAddon : Addon() {
    
    override val projectDistributors = listOf(/*your distributors*/)

}
```

By default, there are four different distributors available:

| Distributor | Code                                          |
|-------------|-----------------------------------------------|
| SpigotMC    | `ProjectDistributor.spigotmc(/*project id*/)` |
| Hangar      | `ProjectDistributor.hangar(/*project id*/)`   |
| Modrinth    | `ProjectDistributor.modrinth(/*project id*/)` |
| GitHub      | `ProjectDistributor.github(/*project id*/)`   |

You can also create your own distributor by implementing the `ProjectDistributor` interface.

!!! abstract "Order of update checks"

    When checking for updates, all registered distributors are checked in the order they are specified in the list.  
    This means that if you want users to download your updates from a specific distributor, you should put it at the
    top of the list.

!!! abstract "Pre-release versions"

    Users will only be notified of pre-release versions if they themselves are using a pre-release version.