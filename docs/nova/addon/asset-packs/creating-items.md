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

??? abstract "Vanilla item material"

    The vanilla item material (which is used to alter clientside behavior of items) will be automatically chosen based on
    the [item behaviors](../items/item-behaviors.md) (i.e. a damageable item for tools or a sword for tools that can't break blocks in creative).
    
    If you still need to set the material type explicitly, you can do so by setting the `material` property:
    
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