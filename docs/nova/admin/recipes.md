# Customizing Recipes

In Nova, all recipes are customizable. You can find the recipe files under ``plugins/Nova/recipes``  
You can change or delete existing recipes or just create completely new ones. If a recipe gets updated by us, we will
only update it on your server if you haven't modified or deleted it.

You can reload all recipes by running the command `/nova reload recipes`.

## Minecraft Recipe Types

### Shaped Recipes

Shaped recipes are recipes for the Crafting Table that have to follow a specific structure. This is an example crafting
recipe for the Advanced Cable:

```json
{
  "result": "logistics:advanced_cable",
  "amount": 3,
  "shape": [
    "ggg",
    "ccc",
    "ggg"
  ],
  "ingredients": {
    "g": "minecraft:glowstone_dust",
    "c": "logistics:basic_cable"
  }
}
```

!!! info "Shape"

    The shape is the structure of the recipe. You can see that it resembles a Crafting Table. The letters you use here have to  also be present in the ``ingredients`` section. You can use a space if that slot should be empty.

!!! info "Multiple Choices for Ingredients"

     If you want to give players multiple item choices for a single ingredient, you can specify an array of strings instead of a single string for each ingredient.

!!! info ""

    "amount" can be omitted for 1

### Shapeless Recipes

Shapeless recipes are recipes for the Crafting Table that do not follow a specific structure. This is an example recipe
for the Basic Item Filter:

```json
{
  "result": "logistics:basic_item_filter",
  "ingredients": {
    "minecraft:hopper": 1,
    "minecraft:paper": 1
  }
}
```

!!! info "Amount of Items"

     The number after the ingredient names represents the amount of items that need to be present in the crafting table.

Like in shaped recipes, it is also possible to give multiple choices for a specific ingredient.  
The following recipe would allow players to either use paper or an iron plate to craft a Basic Item Filter.

```json
{
  "result": "logistics:basic_item_filter",
  "ingredients": [
    {
      "item": "minecraft:hopper",
      "amount": 1
    },
    {
      "items": [
        "nova:iron_plate",
        "minecraft:paper"
      ],
      "amount": 1
    }
  ]
}
```

### Furnace Recipes

This is an example recipe for smelting iron dust into iron ingots:

```json
{
  "result": "minecraft:iron_ingot",
  "input": "machines:iron_dust",
  "experience": 1.0,
  "time": 100
}
```

!!! info "Multiple Choices for Ingredients"

      If you want to give players multiple item choices for a single ingredient, you can specify an array of strings instead of a single string for the input.

!!! info "Time"

     The time is in ticks. One second is 20 ticks.

## Machines Recipe Types

### Pulverizer Recipes

This is an example recipe for pulverizing iron ore into iron dust:

```json
{
  "input": [
    "minecraft:iron_ore",
    "minecraft:deepslate_iron_ore"
  ],
  "result": "machines:iron_dust",
  "amount": 2,
  "time": 200
}
```

!!! info "Time"

    The time is in ticks. One second is 20 ticks.

### Mechanical Press Recipes

Recipes for the mechanical press are grouped in the sub-folders ``gear/`` and ``plate/``  
Both use the same syntax.  
This is an example recipe for pressing an iron plate:

```json
{
  "input": "minecraft:iron_ingot",
  "result": "machines:iron_plate",
  "time": 200
}
```

!!! info "Multiple Choices for Ingredients"

    If you want to give players multiple item choices for a single ingredient, you can specify an array of strings instead of a single string for the input.

!!! info "Time"

    The time is in ticks. One second is 20 ticks.

### Fluid Infuser Recipes

The Fluid Infuser can be used in two modes: Inserting fluids into an item or extract fluids from an item.  
This is an example recipe for inserting water into a bucket to create a water bucket:

```json
{
  "mode": "INSERT",
  "fluid_type": "WATER",
  "fluid_amount": 1000,
  "input": "minecraft:bucket",
  "result": "minecraft:water_bucket",
  "time": 100
}
```

!!! info "Mode"

    The mode specifies if this should be a recipe for inserting (``INSERT``) or extracting (``EXTRACT``) fluids.

!!! info "Fluid Type"

    Currently, there are only ``WATER`` and ``LAVA``. Custom fluids from other plugins are not supported.

!!! info "Time"

     The time is in ticks. One second is 20 ticks.

This is an example recipe for extract water from a water bottle to create an empty bottle:

```json
{
  "mode": "EXTRACT",
  "fluid_type": "WATER",
  "fluid_amount": 300,
  "input": "minecraft:potion{\"Potion\": \"minecraft:water\"}",
  "result": "minecraft:glass_bottle",
  "time": 30
}
```

!!! info "Custom Item Format"

     As a water bottle is not its own item, a Custom Item Format is required here. See \"Item Formats\" below for more information.

!!! info "Time"

    The time is in ticks. One second is 20 ticks.

### Electric Brewing Stand Recipes

Using these recipes, you can configure which potion types can be created using the electric brewing stand. You're also
able to configure their ingredients, as well as multipliers for duration and amplifier level and the max amount of these
levels.

This recipe would add the luck effect type to the electric brewing stand:

```json
{
  "result": "minecraft:luck",
  "default_time": 1800,
  "redstone_multiplier": 2,
  "glowstone_multiplier": 0.5,
  "max_duration_level": 5,
  "max_amplifier_level": 5,
  "inputs": [
    "minecraft:nether_wart",
    "minecraft:grass_block"
  ]
}
```

!!! info "default_time"

     The default time a potion with this effect would have. In ticks, 20 ticks = 1s. This potion would have a default time of 1:30

!! info "redstone_multiplier"

     The time multiplier when a duration level (one redstone) is added. This means a luck potion with level two duration would last 3:00, level three 4:30 and so on.

!! info "glowstone_multiplier"

     In Minecraft, when glowstone is added to a potion in order to increase the amplifier level, the duration is reduced. This is represented by this multiplier. A potion with an amplifier of level two would have a duration of 0:45, level three 0:11 and so on.

!! info "max_duration_level"

     The maximum allowed duration level for a potion of this effect. By default, you cannot create an effect with both an increased duration level and an increased amplifier level, but you are able to change this in the config file for the electric brewing stand.

!! info "max_amplifier_level"

     The maximum allowed amplifier level for a potion of this effect. By default, you cannot create an effect with both an increased duration level and an increased amplifier level, but you are able to change this in the config file for the electric brewing stand.

!! warning "Multiple Item Choices"

     In this recipe type, multiple item choices for one ingredient are **not** allowed.

## Item Formats

There are multiple ways for you to specify an item in a recipe:

#### Custom Item Format

This format allows you to use a custom item from Nova or any other supported plugin. For example ``itemsadder:ruby``
would also work here.

```json
"machines:copper_gear"
```

With items from Nova addons, it is also possible to use the ``nova:`` prefix instead of the addon's id. This will cause all items from different addons with that id to be accepted. For example, if multiple addons define a ``copper_dust``, ``machines:copper_dust`` would only accept the copper dust from the Machines addon, but ``nova:copper_dust`` would allow any copper dust.

#### Complex Item Format

This format lets you fully customize the required item. If you use this format, you won't be able to use custom
namespaces like ``nova:``  
As this checks the item exactly (only ignoring the item name), you might encounter some issues with enchantments and
other data stored inside the item.  
This is the same format as in Minecraft's /give command. As it is in JSON, quotes need to be escaped.

```json
"minecraft:potion{\"Potion\": \"minecraft:water\"}"
```

## Item- & Recipe Fallbacks

While this is more intended for developers, item- and recipe fallbacks can also be used by server administrators.  

**What are item- and recipe fallbacks?**  
Fallbacks can be used to define an item or recipe to fall back to when the item could not be found or the recipe could not be loaded.
This is useful for addon developers as it allows them to use items from other addons in their crafting recipes without creating a hard dependency on that addon.

### Item Fallbacks

Item fallbacks are defined by adding a semicolon after the item declaration, followed by a second declaration:
```json
"nova:basic_fluid_tank; minecraft:bucket"
```
The recipe loader will first check if ``nova:basic_fluid_tank`` exists. If not, ``minecraft:bucket`` is used.

### Recipe Fallbacks

In some cases, it makes sense to completely change the structure of a recipe if the items from another addon are missing.  
For that, just put multiple recipe objects into a json array:

```json
[
  {
    "result": "addon1:result_item",
    "shape": [
      "a  ",
      " a ",
      "  a"
    ],
    "ingredients": {
      "t": "addon2:example_item"
    }
  },
  {
    "result": "addon1:result_item",
    "shape": [
      " a  ",
      " a ",
      " a "
    ],
    "ingredients": {
      "t": "addon1:fallback_item"
    }
  }
]
```

!!! info

       If required, it is also possible to use item fallbacks inside of recipe fallbacks.

If you don't want any exceptions in the console if none of the fallbacks could be loaded, you can set the ``failSilently`` boolean to ``true``.

```json
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
        "t": "addon2:example_item"
      }
    },
    {
      "result": "addon1:result_item",
      "shape": [
        " a  ",
        " a ",
        " a "
      ],
      "ingredients": {
        "t": "addon1:fallback_item"
      }
    }
  ]
}
```