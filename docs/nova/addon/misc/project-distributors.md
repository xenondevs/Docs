# Configuring project distributors for update notifications

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