# Customizing Recipes

In Nova, all recipes are customizable. You can find the recipe files under ``plugins/Nova/recipes``  
You can change or delete existing recipes or just create completely new ones. If a recipe gets updated by us, we will
only update it on your server if you haven't modified or deleted it.

You can reload all recipes by running the command `/nova reload recipes`.

## Item Formats

There are multiple ways for you to specify an item in a recipe:

### Custom Item Format

This format allows you to use a custom item from Nova or any other supported plugin. For example ``itemsadder:ruby``
would also work here.

```json title="Custom Item Format"
"machines:copper_gear"
```

With items from Nova addons, it is also possible to use the ``nova:`` prefix instead of the addon's id. This will cause all items from different addons with that id to be accepted. For example, if multiple addons define a ``copper_dust``, ``machines:copper_dust`` would only accept the copper dust from the Machines addon, but ``nova:copper_dust`` would allow any copper dust.

### Complex Item Format

This format lets you fully customize the required item. If you use this format, you won't be able to use custom
namespaces like ``nova:``  
As this checks the item exactly (only ignoring the item name), you might encounter some issues with enchantments and
other data stored inside the item.  
This is the same format as in Minecraft's /give command. As it is in JSON, quotes need to be escaped.

```json title="Complex Item Format"
"minecraft:potion{\"Potion\": \"minecraft:water\"}"
```

## Item- & Recipe Fallbacks

While this is more intended for developers, item- and recipe fallbacks can also be used by server administrators.

**What are item- and recipe fallbacks?**  
Fallbacks can be used to define an item or recipe to fall back to when the item could not be found or the recipe could not be loaded.
This is useful for addon developers as it allows them to use items from other addons in their crafting recipes without creating a hard dependency on that addon.

### Item Fallbacks

Item fallbacks are defined by adding a semicolon after the item declaration, followed by a second declaration:
```json title="Item Fallback"
"nova:basic_fluid_tank; minecraft:bucket"
```
The recipe loader will first check if ``nova:basic_fluid_tank`` exists. If not, ``minecraft:bucket`` is used.

### Recipe Fallbacks

In some cases, it makes sense to completely change the structure of a recipe if the items from another addon are missing.  
For that, just put multiple recipe objects into a json array:

??? example "Example Recipes"

    === "Normal"

        ```json title="recipe.json"
        [
          {
            "result": "addon1:result_item",
            "shape": [
              "a  ",
              " a ",
              "  a"
            ],
            "ingredients": {
              "a": "addon2:example_item"
            }
          },
          {
            "result": "addon1:result_item",
            "shape": [
              " a ",
              " a ",
              " a "
            ],
            "ingredients": {
              "a": "addon1:fallback_item"
            }
          }
        ]
        ```

        !!! info
        
            If required, it is also possible to use item fallbacks inside of recipe fallbacks.

    === "With failSilently"

        If you don't want any exceptions in the console if none of the fallbacks could be loaded, you can set the ``failSilently`` boolean to ``true``.
        
        ```json title="recipe.json"
        {
          "failSilently": true,
          "recipes": [
            {
              "result": "addon1:result_item",
              "shape": [
                "a  ",
                " a ",
                "  a"
              ],
              "ingredients": {
                "a": "addon2:example_item"
              }
            },
            {
              "result": "addon1:result_item",
              "shape": [
                " a ",
                " a ",
                " a "
              ],
              "ingredients": {
                "a": "addon1:fallback_item"
              }
            }
          ]
        }
        ```

        !!! info
        
            If required, it is also possible to use item fallbacks inside of recipe fallbacks.