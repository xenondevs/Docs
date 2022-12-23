## What are Virtual Inventories?

Virtual inventories are inventories, that can be used inside GUIs.
Like normal inventories, they can store a predefined amount of `ItemStacks`, but unlike
Minecraft's inventories, virtual inventories do not have a defined width or height, just a size.

## Creating a Virtual Inventory

To create a `VirtualInventory`, you can do one of two things:

* Call the `VirtualInventory` constructor directly
* Use the `VirtualInventoryManager` to get a previously serialized `VirtualInventory`. This `VirtualInventory` will then also be serialized when the plugin gets disabled.

!!! info

    The `uuid` parameter is only required for serialization. You can set it to null, if you're not planning to serialize your inventory.

## Inventory Events

You can also register update handlers to your `VirtualInventory`.

The handler for the `ItemUpdateEvent` registered with `setItemUpdateHandler` will be called before changes were fully processed.
This means that both cancelling the event and modifying the stack size of the new item stack
will have effects on the source of the change. (i.e. A player put 64 items into the inventory, but
the amount gets changed to 32 in the event -> the player will keep 32 items on their cursor)

The handler for the `InventoryUpdatedEvent` registered with `setInventoryUpdatedHandler` will be called after
changes were processed. You can't cancel this event, but you can use it to remove items from the inventory
without it having an effect on the source of the change. This might be useful trash can inventories or similar.

## Virtual Inventories in GUIs

Adding a `VirtualInventory` to a GUI can be done the same way as adding Items.
You either define an ingredient for the VirtualInventory in `Structure`, use the filling
methods in `GUI`, or create a `SlotElement.VISlotElement` which links to the specific slot.  
When creating a `VISlotElement`, you can also define a background `ItemProvider`, which will
be shown until an actual ItemStack has been placed in the `VirtualInventory`.

### GUI shift priority

If you have multiple virtual inventories in one GUI, you might want to change the order of
which items are added to them with shift-clicks. This can be done by setting the `guiShiftPriority`
in `VirtualInventory`. The inventory with the highest priority will be used first.

### Custom Stack Sizes

Virtual inventories also allow customizing the stack sizes of every slot.
You can change them by providing a `stackSizes` array in the constructor.

If you're creating a plugin that modifies maximum stack sizes of items, change the
`StackSizeProvider` in `InventoryUtils#stackSizeProvider` to a custom one you've created.  
This will make InvUI respect your maximum stack sizes.
(Please note that you can't have a maximum stack size higher than what is normally possible in vanilla Minecraft.)

## Serialization

As addressed previously, the `VirtualInventoryManager` is capable of serializing and deserializing
virtual Inventories. Virtual inventories obtained with `createNew`, `getByUUID` and `getOrCreate`
will be automatically serialized when the plugin gets disabled. These inventories are stored under
`plugins/InvUI/VirtualInventory/<Name of your plugin>/`.

You can also directly access `VirtualInventoryManager#serializeInventory` and `VirtualInventoryManager#deserializeInventory`
to (de)serialize virtual inventories from/to streams or byte arrays.