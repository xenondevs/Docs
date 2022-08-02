# Creating items

## Creating your first material

To start of open the newly created ``materials.json`` file. This file will contain all materials needed by your addon.
Both
items and blocks are described in this file. So let's create a simple ruby item. We can use minecraft's [old unused ruby
texture](https://i.imgur.com/VW3UMqh.png).

We just have to add it to our materials file:

```json title="materials.json"
{
  "ruby": "item/ruby"
}
```

And add the texture to our asset pack at ``assets/textures/item/ruby.png``. So our file structure looks like this:

![file structure](https://i.imgur.com/GVf5LHf.png)

If you want an item with a custom model, you can just link to it the same way. Just put the model file the models folder
instead.

## Item types

There are of course different item types, depending on the properties you need for your material. For example,
damageable,
translucent, consumable, etc. To use these item types we use the ``item_type`` property. These types will let Nova automatically
assign the correct vanilla material. So let's make an edible ruby material:

```json title="materials.json"
{
  "ruby": {
    "item": {
      "type": "consumable",
      "model": "item/ruby"
    }
  }
}
```

!!! warning

    The type alone doesn't give the item any functionality, but just changes the underlying vanilla material.  
    To actually make it consumable, we'll have to add a Consumable item behavior in the code later.

???+ example "Available item types"

    * ``default`` - The default item type. You don't need to specify this manually.
    * ``damageable`` - An item that can be damaged.
    * ``consumable`` - An item that can be consumed.
    * ``always_consumable`` - An item that can be consumed even if the player's hunger is full.
    * ``fast_consumable`` - An item that can be consumed faster than the default.

If none of these item types are appropriate, you can use the ``material`` property to explicitly set a material.

```json title="materials.json"
{
  "ruby": {
    "item": {
      "material": "diamond",
      "model": "item/ruby"
    }
  }
}
```

## Items with multiple models

Some items have multiple models. For example, the vanilla bow item has multiple models while drawing the bow. Nova makes
this process a lot easier. Instead of having to specify each model explicitly, you can specify a range and file name
format.
For example a diamond bow with multiple models would look like this:

```json title="materials.json"
{
  "diamond_bow": {
    "item": {
      "models": {
        "item/diamond_bow/%s": [0, 3]
      }
    }
  }
}
```

This will generate a diamond bow with 4 models using the textures``texture/item/diamond_bow/0`` -
``texture/item/diamond_bow/3``.

If your models don't have a fixed number format, you can also list them by hand:

```json title="materials.json"
{
  "diamond_bow": {
    "item": {
      "models": [
        "item/diamond_bow/not_pulled",
        "item/diamond_bow/pulled",
        "item/diamond_bow/shooting",
        "item/diamond_bow/releasing"
      ]
    }
  }
}
```

We'll implement these items in code later. Let's create a block in the asset-pack in the next section.