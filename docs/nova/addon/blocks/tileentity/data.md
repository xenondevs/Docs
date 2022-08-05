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

## Storing data

Storing TileEntity data should be done by overriding the ``saveData`` function. **Make sure to call the superclass's function.**

```kotlin title="MechanicalPress.kt"
override fun saveData() {
    super.saveData()
    storeData("pressType", type)
    storeData("pressTime", timeLeft)
}
```

## Retrieving data

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