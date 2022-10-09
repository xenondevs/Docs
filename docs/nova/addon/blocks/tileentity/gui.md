# TileEntity GUI

!!! info "Check out the InvUI wiki"

    If you're not familiar with the InvUI library, you'll have to trouble understanding the following guide. You can check
    out the wiki [here](../../../../invui). Nova registers some default ingredients which can be used
    in the GUIBuilder. You can check out the default ingredients [here](https://github.com/xenondevs/Nova/blob/main/nova/src/main/kotlin/xyz/xenondevs/nova/ui/GlobalStructureIngredients.kt).
    **Don't register your own global ingredients!**

As you probably noticed, the TileEntity needs a ``Lazy<TileEntityGUI>`` property. It's lazy to save performance and only
load a GUI when needed. To create a new GUI, you need to create an inner class that extends ``TileEntityGUI``. In this
class override the ``gui`` property and set it to the GUI you want to display. For now, let's create a GUI with a single
energy bar.

```kotlin
inner class SolarPanelGUI : TileEntityGUI() {
    
    override val gui: GUI = GUIBuilder(GUIType.NORMAL)
        .setStructure(
            "1 - - - - - - - 2",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "3 - - - - - - - 4")
        .addIngredient('e', EnergyBar(3, energyHolder)) // (1)
        .build()
    
}
```

1. The ``energyHolder`` will be explained in an upcoming section.

Now we can properly set the ``gui`` property inside the TileEntity class.

```kotlin
override val gui = lazy(::SolarPanelGUI)
```

## Side Config GUI

If you want to allow players to change the side configuration of your TileEntity through the GUI, you can use the
built-in `SideConfigGUI`.

```kotlin title="SideConfigGUI Constructor"
class SideConfigGUI(
    endPoint: NetworkEndPoint, // (1)
    inventoryNames: List<Pair<NetworkedInventory, String>>? = null, // (2)
    fluidContainerNames: List<Pair<FluidContainer, String>>? = null, // (3)
    openPrevious: (Player) -> Unit // (4)
) 
```

1. Your TileEntity
2. A list of `NetworkedInventory` to inventory name (localized) pairs. The `NetworkedInventory` instance can be obtained
    from the `VirtualInventory` by calling `NovaItemHolder#getNetworkedInventory`
3. A list of `FluidContainer` to container name (localized) pairs.
4. A method to open the previous GUI. In a `TileEntityGUI`, this can reference `::openWindow`

Depending on the network types of your TileEntity, the SideConfigGUI will adjust accordingly.

The UI item for opening the side config gui is called `OpenSideConfigItem` and just takes the `SideConfigGUI` as parameter.

```kotlin
inner class SolarPanelGUI : TileEntityGUI() {

    private val sideConfigGUI = SideConfigGUI(
        this@SolarPanel,
        ::openWindow
    )

    override val gui: GUI = GUIBuilder(GUIType.NORMAL)
        .setStructure(
            "1 - - - - - - - 2",
            "| s # # e # # # |",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "3 - - - - - - - 4")
        .addIngredient('e', EnergyBar(3, energyHolder))
        .addIngredient('s', OpenSideConfigItem(sideConfigGUI))
        .build()

}
```