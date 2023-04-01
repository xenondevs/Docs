## Getting an ItemStack
To get an ItemStack from a NovaItem, you can either call `createItemBuilder().get()` or `createItemStack(amount)`.

## Getting ItemBehaviors
Using the function `hasItemBehavior<T>()` and `getItemBehavior<T>()` you can check for and get an ItemBehavior of a certain type.

## ItemProviders
ItemProviders are just wrappers for ItemStacks, [so that they can be used in InvUI GUIs](../../../../invui/items).  
There are two different providers arrays available:

| Name                     | Description                                        |
|--------------------------|----------------------------------------------------|
| basicClientsideProviders | The client-side providers without lore or nbt data |
| clientsideProviders      | The client-side providers with lore and nbt data   |

The elements in the arrays represent [the different models specified in the materials.json](../asset-packs/creating-items.md).

You can also use `basicClientsideProvider` and `clientsideProvider`, which are both the first element of their array.

### Understanding Packet Items
To understand the difference between a normal (server-side) and a client-side item, you first need to understand how custom
items are handled in Nova.  
In order to be extremely flexible when it comes to changing custom model data, the underlying vanilla item type, the lore
format of the item or its display name, Nova's ItemStacks do not store this information at all.
All of these values are actually only applied on packet level, this can be observed by running the command
`/data get entity @p SelectedItem` while holding an item from Nova: its item type will always be `shulker_shell` and it
won't have any custom model data, display name or lore, even though it has one for your game.  
Coming back to client-side providers: These are wrappers for the ItemStacks that the client actually sees.
They should only be used in cases where the ItemStack isn't actually stored anywhere, for example as a button in a GUI
or as the head of a `FakeArmorStand`.  

!!! info

    Generally, you should use `clientsideProviders` or `basicClientsideProviders` when working with GUIs and `createItemStack(amount)`
    if you need an item to give to a player.