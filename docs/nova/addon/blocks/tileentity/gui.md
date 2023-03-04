# TileEntity GUI

!!! info "Check out the InvUI wiki"

    If you're not familiar with the InvUI library, you'll have to trouble understanding the following guide. You can check
    out the wiki [here](../../../../../invui). Nova registers some default ingredients which can be used
    in the GUIBuilder. You can check out the default ingredients [here](https://github.com/xenondevs/Nova/blob/main/nova/src/main/kotlin/xyz/xenondevs/nova/ui/GlobalStructureIngredients.kt).
    **Don't register your own global ingredients!**

As you probably noticed, the TileEntity needs a ``Lazy<TileEntityGui>`` property. It's lazy to save performance and only
load a Gui when needed. To create a new Gui, you need to create an inner class that extends ``TileEntityGui``. In this
class override the ``gui`` property and set it to the Gui you want to display. For now, let's create a Gui with a single
energy bar.

```kotlin
inner class SolarPanelGui : TileEntityGui() {
    
    override val gui = Gui.normal()
        .setStructure(
            "1 - - - - - - - 2",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "3 - - - - - - - 4")
        .addIngredient('e', EnergyBar(3, energyHolder)) // (1)!
        .build()
    
}
```

1. The ``energyHolder`` will be explained in an upcoming section.

Now we can properly set the ``gui`` property inside the TileEntity class.

```kotlin
override val gui = lazy(::SolarPanelGui)
```

## SideConfigGui

If you want to allow players to change the side configuration of your TileEntity through the Gui, you can use the
built-in `SideConfigGui`.

```kotlin
class SideConfigGui(
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

Depending on the network types of your TileEntity, the SideConfigGui will adjust accordingly.

The UI item for opening the side config gui is called `OpenSideConfigItem` and just takes the `SideConfigGui` as parameter.

```kotlin
inner class SolarPanelGui : TileEntityGui() {

    private val sideConfigGui = SideConfigGui(
        this@SolarPanel,
        ::openWindow
    )

    override val gui = Gui.normal()
        .setStructure(
            "1 - - - - - - - 2",
            "| s # # e # # # |",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "3 - - - - - - - 4")
        .addIngredient('e', EnergyBar(3, energyHolder))
        .addIngredient('s', OpenSideConfigItem(sideConfigGui))
        .build()

}
```
