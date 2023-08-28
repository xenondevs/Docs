## Making your TileEntity upgradeable

In order to make your TileEntity upgradeable, you'll need to implement the `Upgradeable` interface.  
Then, create a `UpgradeHolder` via `getUpgradeHolder` and set the allowed upgrade types. After that, you can pass on that
upgrade holder to the different energy holders, if you have one.

### Calculating upgraded values

While the energy holder automatically changes it's `maxEnergy` or `energyConsumption` values, you might want to implement
your own logic that is called whenever upgrades change.  
To do this, you can either:

* Override the `reload` method in your TileEntity (make sure to keep the super call) and retrieve the current upgrade modifier
  for a certain upgrade type by calling `UpgradeHolder#getValue(UpgradeType)`. (The reload method is called whenever an
  upgrades were added or removed and when reloading configs.)
* Use `UpgradeHolder.getValueProvider(UpgradeType)` to get a provider that will automatically update whenever the upgrade modifier
  changes.

??? example

    ```kotlin title="Using reload function"
    override fun reload() {
        super.reload()
        maxIdleTime = (IDLE_TIME / upgradeHolder.getValue(UpgradeType.SPEED)).toInt()
    }
    ```

    ```kotlin title="Using value provider"
    val maxIdleTime by upgradeHolder.getValueProvider(UpgradeType.SPEED) { (IDLE_TIME / it).toInt() }
    ```

## Using the UpgradesGui

The `UpgradesGui` can easily be added to your `TileEntityGui` by creating an `OpenUpgradesItem` with your `upgradeHolder`.

```kotlin
inner class SolarPanelGui : TileEntityGui() {
    
    override val gui = Gui.normal()
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

### Creating an Upgrade Type Registry

Create an `UpgradeTypeRegistry` singleton object and annotate it with `#!kotlin @Init` to have it loaded during addon initialization.

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object UpgradeTypes : UpgradeTypesRegistry by ExampleAddon.registry {
    
    // (2)!
    
}
```

1. Nova will load this class during addon initialization, causing your upgrade types to be registered.
2. Register your upgrade types here

Now, lets actually register an upgrade type. For that we'll need two `NovaItems`:
One for the actual item that is used by players and one for the icon in the GUI, which needs to have an inventory background.

Assuming you have these two items, you can now register your upgrade type:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object UpgradeTypes {
    
    val MY_UPGRADE_TYPE = registerUpgradeType<Double>(ExampleAddon, "example_upgrade", Items.EXAMPLE_UPGRADE, Items.GUI_EXAMPLE_UPGRADE)
    
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

For more information about the `upgrade_values.json` format, check out
[Configuration - Upgrade Values](../../../admin/configuration.md#upgrade-values).