## Region

Generally, a region is an area between a `min` and a `max` Location.  

```kotlin
val region = Region(min, max)
```

The `Region` companion object provides several utility functions for creating regions, such as:

- `#!kotlin Region.surrounding(pos, radius)`
- `#!kotlin Region.inFrontOf(tileEntity, ...)`
- and more

### Visualization

To display the outline of this region with particles, you can use the `VisualRegion` object:

```kotlin
// to show the region:
VisualRegion.showRegion(player, regionUUID, region)
// to hide the region
VisualRegion.hideRegion(player, regionUUID)
// to toggle on / off
VisualRegion.toggleView(player, regionUUID, region)
```

If you want a "Visualize Region" button in your GUI, you can use the `VisualRegionItem`:

```kotlin
VisualizeRegionItem(regionUuid) { region }
```

## Dynamic Region

A `DynamicRegion` is a type of region intended for use in tile-entities: Using a `MutableProvider<Int>` for the size,
the region can be dynamically resized. It provides several gui-components to inspect, modify, and visualize the region.

Using `TileEntity#storedRegion`, we can create a `DynamicRegion`:

```kotlin
class ExampleTileEntity(pos: BlockPos, blockState: NovaBlockState, data: Compound) : TileEntity(pos, blockState, data) {
    
    private val region = storedRegion(
        "region",
        minSize = provider(1), // (1)!
        maxSize = provider(10), // (2)!
        defaultSize = 5, // (3)!
        createRegion = { size -> Region.surrounding(pos, size) } // (4)!
    )
    
    @TileEntityMenuClass
    inner class ExampleTileEntityMenu(player: Player) : IndividualTileEntityMenu(player) {
        
        override val gui = Gui.builder()
            .setStructure(
                "v # # # # # # # #",
                "# # + # d # - # #",
                "# # # # # # # # #")
            .addIngredient('+', region.increaseSizeItem)
            .addIngredient('-', region.decreaseSizeItem)
            .addIngredient('d', region.displaySizeItem)
            .addIngredient('v', region.visualizeRegionItem)
            .build()
        
    }
    
}
```

1. The minimum size of the region.
2. The maximum size of the region.
3. The default size of the region when it is created. After that, the size can be changed and changes will be saved.
4. A lambda that creates the desired region based on the configured size. This is invoked every time the size is changed.