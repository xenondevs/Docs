# Making a TileEntity

## Config

Let's start off by making a simple config file for our Solar Panel in ``resources/configs/solar_panel.yml``:

```yaml
capacity: 10000
energy_per_tick: 40
```

We can then load these config values in top level declarations of our Solar Panel:

```kotlin

private val MAX_ENERGY = configReloadable { NovaConfig[SOLAR_PANEL].getLong("capacity") }
private val ENERGY_PER_TICK = configReloadable { NovaConfig[SOLAR_PANEL].getLong("energy_per_tick") }

class SolarPanel(blockState: NovaTileEntityState) : NetworkedTileEntity(blockState) {
    // ...
}
```

By wrapping them in ``configReloadable``, they'll be automatically updated when the config is reloaded. Now let's make
our Solar Panel actually work.

# Holders

Holders are classes that are used to store/handle specific data like energy amount or side config data. Every 
``NetworkedTileEntity`` has an ``energyHolder``, an ``itemHolder`` and a ``fluidHolder`` property. To actually use them,
you have to override them. The SolarPanel provides energy to other machines in the network, so it needs an ``EnergyHolder`` 
instance:

```kotlin
override val energyHolder = ProviderEnergyHolder(this, MAX_ENERGY, ENERGY_PER_TICK, null) { // (1)
    createExclusiveSideConfig(NetworkConnectionType.EXTRACT, BlockSide.BOTTOM) // (2)
}
```

1. ``null`` is the ``UpgradeHolder`` instance, more on this later.
2. This sets the side config to exclusively extract energy from the bottom of the block.

??? example "More holder examples"

    === "EnergyHolder example: energy consuming tileEntity"

        ```kotlin
            override val energyHolder = ConsumerEnergyHolder(this,
                MAX_ENERGY,
                ENERGY_PER_TICK,
                null,
                upgradeHolder) { createSideConfig(NetworkConnectionType.INSERT, BlockSide.FRONT) }
        ```

    === "ItemHolder example: tileEntity converting items"
        
        ``ItemHolder``s need VirtualInventories. So in this case, we need an input and output inventory. Which we can
        get by calling ``getInventory``:

        ```kotlin
            private val inputInventory = getInventory("input", 1)
            private val outputInventory = getInventory("output", 1)
        ```

        You can also give these inventories update handlers. For example if an item is removed, print "Item removed" to
        the console:
        
        ```kotlin
             private val inputInventory = getInventory("input", 1) {
                if(it.isRemove)
                    println("Item removed!")
             }
        ```

        You can then pass these inventories to the ``ItemHolder``:

        ```kotlin
            override val itemHolder = NovaItemHolder(
                this,
                inputInventory to NetworkConnectionType.BUFFER,
                outputInventory to NetworkConnectionType.EXTRACT
            ) { createSideConfig(NetworkConnectionType.INSERT, BlockSide.FRONT) } // (1)
        ```

        1. Set all sides to insert except the front.

    === "FluidHolder example: freezer"

        First, we need an input tank:
        
        ```kotlin
            private val waterTank = getFluidContainer("water", setOf(FluidType.WATER), WATER_CAPACITY, 0)
        ```

        We can then pass this tank to the ``FluidHolder``:
        
        ```kotlin
            override val fluidHolder = NovaFluidHolder(this, waterTank to NetworkConnectionType.BUFFER) { 
                createSideConfig(NetworkConnectionType.INSERT, BlockSide.FRONT) // (1)
            }
        ```

        1. Set all sides to insert except the front.