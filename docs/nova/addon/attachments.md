# Attachments

## What is an Attachment?

In Nova, an `Attachment` is a (fake) entity riding a player, but you'll mostly likely use the `ItemAttachment`
implementation which is a clientside armor stand riding a player while wearing a custom item as a helmet.  
The attachment system makes assigning models to players easy, as it handles all the riding logic.
Once a player is given an attachment, it will stay on that player until it is removed again.

## Creating an AttachmentType

To create a new `AttachmentType`, use the `register` method in `AttachmentTypeRegistry`.  
We recommend creating a singleton object to store all attachment types. These should be registered during Addon initialization.

```kotlin
object ExampleAddon : Addon() {
    
    override fun init() {
        Items.init()
        Blocks.init()
        Attachments.init()
    }
    
}
```

```kotlin
object Attachments {
    
    val EXAMPLE_ATTACHMENT = AttachmentTypeRegistry.register(ExampleAddon, "example_attachment") { ItemAttachment(it, Items.ATTACHMENT_ITEM) }
    
    fun init() = Unit
    
}
```

Then, add the attachment to a player:

```kotlin
AttachmentManager.addAttachment(player, Attachments.EXAMPLE_ATTACHMENT)
```

And this is how you would remove it again:

```kotlin
AttachmentManager.removeAttachment(player, Attachments.EXAMPLE_ATTACHMENT)
```

## Modifying Attachment Logic

You can also change the attachment logic by either directly implementing the `Attachment` interface or by extending the
`ItemAttachment` class. Then, just call the constructor of your 'Attachment' subclass when registering the attachment type.

If you need an attachment which gets hidden when a player looks down, check out the `HideOnDownItemAttachment`.