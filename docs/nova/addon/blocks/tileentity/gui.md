# TileEntity GUI

!!! info "Check out the InvUI wiki"

    If you're not familiar with the InvUI library, you'll have to trouble understanding the following guide. You can check
    out the wiki [here](../../../../invui). Nova registers some default ingredients which can be used
    in the GUIBuilder. You can check out the default ingredients [here](https://github.com/xenondevs/Nova/blob/main/Nova/src/main/kotlin/xyz/xenondevs/nova/ui/GlobalStructureIngredients.kt).
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

1. The ``energyHolder`` will be explained in the next section.

Now we can properly set the ``gui`` property inside the TileEntity class.

```kotlin
override val gui = lazy { SolarPanelGUI() }
```

And that's it for the GUI.