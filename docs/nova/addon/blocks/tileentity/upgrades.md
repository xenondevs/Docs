# Upgrades

## Making your TileEntity upgradeable

In order to make your TileEntity upgradeable, you'll need to implement the `Upgradeable` interface.  
Then, create a `UpgradeHolder` via `getUpgradeHolder` and set the allowed upgrade types. After that, you can pass on that
upgrade holder to the different energy holders, if you have one.

### Calculating upgraded values

While the energy holder automatically changes it's `maxEnergy` or `energyConsumption` values, you might want to implement
your own logic that is called whenever upgrades change. To do this, override the `reload` method in your TileEntity
(make sure to keep the super call). This method is called when an upgrade is added/removed or the configs are reloaded,
which could also affect upgrade modifiers.  
Then, retrieve the current upgrade modifier for a certain upgrade type by calling `UpgradeHolder#getValue(UpgradeType)`

??? example

    ```kotlin title="AutoFisher"
    override fun reload() {
        super.reload()
        maxIdleTime = (IDLE_TIME / upgradeHolder.getValue(UpgradeType.SPEED)).toInt()
        if (timePassed > maxIdleTime) timePassed = maxIdleTime
    }
    ```

!!! tip

    Consider calling the `reload` method in the init block instead of duplicating the calculation code.

## Using the Upgrades GUI

The `UpgradesGUI` can easily be added to your `TileEntityGUI` by creating an `OpenUpgradesItem` with your `upgradeHolder`.

```kotlin
inner class SolarPanelGUI : TileEntityGUI() {
    
    override val gui: GUI = GUIBuilder(GUIType.NORMAL)
        .setStructure(
            "1 - - - - - - - 2",
            "| u # # e # # # |",
            "| # # # e # # # |",
            "| # # # e # # # |",
            "3 - - - - - - - 4")
        .addIngredient('e', EnergyBar(3, energyHolder))
        .addIngredient('u', OpenUpgradesItem(upgradeHolder))
        .build()

}
```

## Creating a custom Upgrade Type

### Time and Place of Registration

Just like nova materials, upgrade types should be registered during addon initialization, i.e. in the `init()` function
of your addon object. We recommend creating a singleton object to house all of your upgrade types:

```kotlin
object UpgradeTypes {
    
    // we will register upgrade types here later
    
    fun init() = Unit
    
}
```

Then, call that init function during addon initialization:

```kotlin
object ExampleAddon : Addon() {

    override fun init() {
        Items.init()
        Blocks.init()
        UpgradeTypes.init()
    }

}
```

Now, lets actually register an upgrade type. For that we'll need two `ItemNovaMaterials`:
One for the actual item that is used by players and one for the icon in the GUI, which needs to have an inventory background.

Assuming you have these two items, you can now register your upgrade type:

```kotlin
object UpgradeTypes {
    
    val MY_UPGRADE_TYPE = UpgradeTypeRegistry.register<Double>(ExampleAddon, "example_upgrade", Items.EXAMPLE_UPGRADE, Items.GUI_EXAMPLE_UPGRADE)
    
    fun init() = Unit
    
}
```

!!! info

    In the example above, the generic type `Double` specifies the type that this upgrade provides. Internally, the
    UpgradeType just casts the configured value from `YamlConfiguration#get`. This means that your upgrade values could
    also be of type 'Int', 'String' or any 'ConfigurationSerializable`.

Now that you've registered your upgrade type, you will also need to set default values for it. For that, create a file
called `upgrade_values.yml` in your `configs/` directory. Then add your upgrade values to it:

```yaml title="upgrade_values.json"
example_upgrade: [ 1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1, 10.0 ]
```

For more information about the upgrade values format, check out the
[configuration page](../../../admin/configuration.md#upgrade-values) on it.