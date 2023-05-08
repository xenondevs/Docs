# TileEntity Menu

!!! info "Check out the InvUI wiki"

    If you're not familiar with the InvUI library, you'll have trouble understanding the following guide. You can check
    out the wiki [here](../../../../../invui). Nova registers some default ingredients which can be used
    in the Gui Builder. You can check out the default ingredients [here](https://github.com/xenondevs/Nova/blob/main/nova/src/main/kotlin/xyz/xenondevs/nova/ui/GlobalStructureIngredients.kt).
    **Don't register your own global ingredients!**

## Creating a TileEntityMenu

If you want your TileEntity to have a GUI, you'll have to create a TileEntityMenu class. You can do this by inheriting
from either `GlobalTileEntityMenu` or `IndividiualTileEntityMenu`. The difference between the two is that the
`GlobalTileEntityMenu` will only have one instance per tile-entity, while the `IndividualTileEntityMenu` will have
one instance per player.

To mark your menu class as a TileEntity menu, you'll have to annotate it with the `@TileEntityMenuClass` annotation.
Nova will automatically instantiate your menu class when needed.

!!! example "Example GUIs"

    === "GlobalTileEntityMenu"
        ```kotlin
        @TileEntityMenuClass
        private inner class SolarPanelMenu : GlobalTileEntityMenu() {
            
            override val gui = Gui.normal()
                .setStructure(
                    "1 - - - - - - - 2",
                    "| u # # e # # # |",
                    "| # # # e # # # |",
                    "| # # # e # # # |",
                    "3 - - - - - - - 4")
                .addIngredient('u', OpenUpgradesItem(upgradeHolder))
                .addIngredient('e', EnergyBar(3, energyHolder)) // (1)!
                .build()
        
        }
        ```

        1. The ``energyHolder`` will be explained in an upcoming section.

        For most cases, this is the menu class you'll want to extend.

    === "IndividualTileEntityMenu"
        ```kotlin
        @TileEntityMenuClass
        private inner class VacuumChestMenu(player: Player) : IndividualTileEntityMenu(player) {
            
            override val gui = Gui.normal()
                .setStructure(
                    "1 - - - - - - - 2",
                    "| s u # i i i p |",
                    "| r # # i i i d |",
                    "| f # # i i i m |",
                    "3 - - - - - - - 4")
                /* ... */
                .addIngredient('r', region.createVisualizeRegionItem(player)) // (1)!
                /* ... */
                .build()
            
        }
        ```
    
        1. This is what we need the Player instance for. The visualize region button can be toggled by every player individually,
        which is why we need different `Gui` instances for each player.  
        <br>
        If you're intrested in the `region` field, you can check out the [Region](./region.md) section.

!!! info "Gui Textures"
    
    If you want to use a `GuiTexture`, simply pass it to the `GlobalTileEntityMenu` / `IndividualTileEntityMenu` constructor.

## Using the SideConfigMenu

If you want to allow players to change the side configuration of your TileEntity through the Menu, you can use the
built-in `SideConfigMenu`.

```kotlin
class SideConfigMenu(
    endPoint: NetworkEndPoint, // (1)!
    inventoryNames: List<Pair<NetworkedInventory, String>>? = null, // (2)!
    fluidContainerNames: List<Pair<FluidContainer, String>>? = null, // (3)!
    openPrevious: (Player) -> Unit // (4)!
) 
```

1. Your TileEntity
2. A list of `NetworkedInventory` to inventory name (localized) pairs. The `NetworkedInventory` instance can be obtained
    from the `VirtualInventory` by calling `NovaItemHolder#getNetworkedInventory`
3. A list of `FluidContainer` to container name (localized) pairs.
4. A method to open the previous GUI. In a `TileEntityGui`, this can reference `::openWindow`

Depending on the network types of your TileEntity, the SideConfigMenu will adjust accordingly.

The UI item for opening the side config menu is called `OpenSideConfigItem` and just takes the `SideConfigMenu` as parameter:

```kotlin
@TileEntityMenuClass
private inner class SolarPanelMenu : GlobalTileEntityMenu() {
    
    private val sideConfigGui = SideConfigGui(
        this@SolarPanel,
        ::openWindow
    )
    
    override val gui = Gui.normal()
        .setStructure(
            "1 - - - - - - - 2",
            "| u # # e # # # |",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "3 - - - - - - - 4")
        .addIngredient('e', EnergyBar(3, energyHolder))
        .addIngredient('s', OpenSideConfigItem(sideConfigGui))
        .build()

}
```
