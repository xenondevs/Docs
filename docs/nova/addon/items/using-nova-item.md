## Getting an ItemStack
To get an ItemStack from a `NovaItem`, use `#!kotlin NovaItem.createItemStack(amount)`.

## Getting ItemBehaviors
Using the function `#!kotlin hasItemBehavior<T>()` and `#!kotlin getItemBehavior<T>()` you can check for and get an ItemBehavior of
a certain type.

## Client-side items

Under `#!kotlin NovaItem.model`, you can find client-side item builders and client-side item providers.

To understand the difference between a normal (server-side) and a client-side item, you first need to understand how custom
items are handled in Nova.  
In order to be extremely flexible when it comes to changing custom model data, the underlying vanilla item type, the lore
format of the item or its display name, Nova's ItemStacks do not store this information at all.
All of these values are actually only applied on packet level, which can be observed by running the command
`/data get entity @p SelectedItem` while holding an item from Nova: its item type will always be `shulker_shell` and it
won't have any custom model data, display name or lore, even though it has one for your game.

Coming back to client-side item builders and providers: These are wrappers for the ItemStacks that the client actually sees.
They should only be used in cases where the ItemStack isn't actually stored anywhere, for example as a button in a GUI
or for `FakeEntities`.  

!!! abstract "Generally, you should use client side providers when working with GUIs and `#!kotlin NovaItem.createItemStack(amount)` if you need an item to give to a player."