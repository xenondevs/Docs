# Simple TileEntity Config

To start off, let's make a simple config file for our Solar Panel:

```yaml title="resources/configs/solar_panel.yml"
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

By wrapping them in ``configReloadable``, they'll be automatically updated when the config is reloaded via ``/nova reload
configs``. Now let's make our Solar Panel actually work.