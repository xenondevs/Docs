# TileEntity data

!!! tip 

    Make sure to check out the CBF documentation for more information.  
    [:material-file-document-outline: CBF Documentation](../../../../../cbf/){ .md-button }

??? example "Default Nova Binary Adapters"

    * Color
    * Location
    * NamespacedKey
    * NamespacedId
    * NetworkType
    * VirtualInventory
    * ItemFilter
    * ItemStack

All of Nova's binary data is handled via cbf. TileEntities have special functions to directly store/retrieve data. You can
call ``storeData`` to store data and ``retrieveData`` or ``retrieveDataOrNull`` to retrieve data.

## Storing / retrieving data with data accessors

To define a property that is automatically saved when the TileEntity's data gets saved, you can use the `storedValue` function.
It returns a `DataAcessor` object to which you can delegate:  

```kotlin title="storedValue (not null)"
private val burnTime: Int by storedValue("burnTime") { 0 }
```

```kotlin title="storedValue (nullable)"
private val itemFilter: ItemFilter? by storedValue("itemFilter")
```

And that's it! When the TileEntity gets saved, those properties will be written to the TileEntity data. Unlike the manual
approach, you will not need to add anything to the `saveData` function.

## Manually storing / retrieving data

### Storing data manually

If you're not using data accessors, store your data in the `saveData` function.

```kotlin title="MechanicalPress.kt"
override fun saveData() {
    super.saveData()
    storeData("pressType", type)
    storeData("pressTime", timeLeft)
}
```

!!! danger

    Make sure to call the superclasses function.

### Retrieving data manually

You can then retrieve the data while initializing your TileEntity's properties.

```kotlin title="MechanicalPress.kt"
private var type: PressType = retrieveData("pressType") { PressType.PLATE }
private var timeLeft: Int = retrieveData("pressTime") { 0 }
```

or

```kotlin title="MechanicalPress.kt"
private var type: PressType = retrieveDataOrNull("pressType") ?: PressType.PLATE
private var timeLeft: Int = retrieveDataOrNull("pressTime") ?: 0
```

## Custom ``BinaryAdapters``

While registering custom ``BinaryAdapters`` for your own classes is encouraged, **don't register them for
anything else.** If you need one for such a type, open an issue on [Nova's GitHub page](https://github.com/xenondevs/Nova/issues/new/choose).
Make sure to include the class name in the title as well.