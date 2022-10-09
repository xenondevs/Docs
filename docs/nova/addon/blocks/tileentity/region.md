# Region

Generally, a region is an area between a `min` and a `max` Location.  

```kotlin
val region = Region(min, max)
```

If your region is related to a `TileEntity`, you can also use the tile-entity functions ``getBlockFrontRegion()``,
``getFrontRegion()`` and ``getSurroundingRegion()`` which create a region relative to the TileEntity.

## Visual Region

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
VisualizeRegionItem(regionUUID) { region }
```

## ReloadableRegion

In some cases, you might want your region's size to be adjustable through player input, upgrades or with the config.  
For those cases, we recommend using a `ReloadableRegion`.

There are three different `ReloadableRegion` implementations available:

!!! example "ReloadableRegion implementations"

    === "StaticRegion"
    
        This is the simplest implementation. It accepts a `ValueReloadable<Int>` for retrieving the size
        and a lambda for creating a `Region` with that size:
        
        ```kotlin
        val region = getStaticRegion(size) { getSurroundingRegion(it) }
        ```
    
    === "DynamicRegion"
    
        The dynamic region allows user-modified sizes. You'll need to set a min, max, and default size as well as
        a lambda for creating a `Region` with that size:
        
        ```kotlin
        val region = getDynamicRegion(minSize, maxSize, defaultSize) { getSurroundingRegion(it) }
        ```
        
        You can then change the size of the region using `region.size` or place the `region.displaySizeItem`,
        `region.increaseSizeItem` and `region.decreaseSizeItem` in your TileEntity's GUI to make the size adjustable by players.
    
    === "UpgradableRegion"
    
        The upgradable region is a subclass of `DynamicRegion` which additionally allows size modification using upgrades.
        You'll only need to specify which `UpgradeType` affects the maximum possible size of your region - everything else
        is handled automatically.
        
        ```kotlin
        val region = getUpgradableRegion(UpgradeType.RANGE, minRange, maxRange, defaultRange) { getSurroundingRegion(it) }
        ```

!!! note

    `ReloadableRegion` and its implementations are specifically designed to be used with TileEntities.  
    Therefore, they can only be created using the above mentioned TileEntity functions.

Every `ReloadableRegion` also provides an instance of a `VisualRegionItem` (`region.visualizeRegionItem`).
You can use this as a show / hide region button in your GUI.