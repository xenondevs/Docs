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
(Note that your `NovaBlock` will require the `TileEntityInteractive` behavior to open the GUI.)

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
    
    If you want to use a [GuiTexture](../fonts/guitextures.md), simply pass it to the `GlobalTileEntityMenu` / `IndividualTileEntityMenu` constructor.