# Customizing Recipes

In Nova, all recipes are customizable. You can find the recipe files under ``plugins/Nova/recipes``  
You can change or delete existing recipes or just create completely new ones. If a recipe gets updated by us, we will
only update it on your server if you haven't modified or deleted it.

There is currently no way to reload recipes or other config files without reloading or restarting the server. Please
also note that reloading is not officially supported, and you should restart your server if you start to experience any
issues.

## Shaped Recipes

Shaped recipes are recipes for the Crafting Table that have to follow a specific structure. This is an example crafting
recipe for the Advanced Cable:

```js
{
  "result": "nova:advanced_cable",
  "amount": 3, // can be ommitted for 1
  "shape": [ // (1)
    "ggg",
    "ccc",
    "ggg"
  ],
  "ingredients": {
    "g": "minecraft:glowstone_dust", // (2)
    "c": "nova:basic_cable"
  }
}
```

1. This is the structure of the recipe. You can see that it resembles a Crafting Table. The letters you use here have to
   also be present in the ``ingredients`` section. You can put a space if that slot should be empty.
2. If you want to give players multiple item choices for a single ingredient, you can specify an array of strings
   instead of a single string here.

## Shapeless Recipes

Shapeless recipes are recipes for the Crafting Table that do not follow a specific structure. This is an example recipe
for the Item Filter:

```js
{
  "result": "nova:item_filter",
  "ingredients": {
    "minecraft:hopper": 1, // This number represents the amount of items
    "minecraft:paper": 1
  }
}
```

Like in shaped recipes, it is also possible to give multiple choices for a specific ingredient.  
The following recipe would allow players to either use paper or an iron plate to craft an Item Filter.

```js
{
  "result": "nova:item_filter",
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

## Furnace Recipes

This is an example recipe for smelting iron dust into iron ingots:

```js
{
  "result": "minecraft:iron_ingot",
  "input": "nova:iron_dust", // (1)
  "experience": 1.0,
  "time": 100 // (2)
}
```

1. Again, for multiple item choices you can set this to an array consisting of all the allowed items
2. The time in ticks. One second is 20 ticks, so this recipe will take 5 seconds.

## Pulverizer Recipes

This is an example recipe for pulverizing iron ore into iron dust:

```js
{
  "input": [
    "minecraft:iron_ore",
    "minecraft:deepslate_iron_ore"
  ],
  "result": "nova:iron_dust",
  "amount": 2,
  "time": 200 // (1)
}
```

1. The time in ticks. One second is 20 ticks, so this recipe will take 10 seconds.

## Mechanical Press Recipes

Recipes for the mechanical press are grouped in the sub-folders ``gear/`` and ``plate/``  
Both use the same syntax.  
This is an example recipe for pressing an iron plate:

```js
{
  "input": "minecraft:iron_ingot",
  "result": "nova:iron_plate", // (1)
  "time": 200 // (2)
}
```

1. Again, for multiple item choices you can set this to an array consisting of all the allowed items
2. The time in ticks. One second is 20 ticks, so this recipe will take 10 seconds.

## Fluid Infuser Recipes

The Fluid Infuser can be used in two modes: Inserting fluids into an item or extract fluids from an item.  
This is an example recipe for inserting water into a bucket to create a water bucket:

```js
{
  "mode": "INSERT", // (1)
  "fluid_type": "WATER", // (2)
  "fluid_amount": 1000,
  "input": "minecraft:bucket",
  "result": "minecraft:water_bucket",
  "time": 100
}
```

1. Specifies if this should be a recipe for inserting (``INSERT``) or extracting (``EXTRACT``) fluids.
2. The fluid type. Currently, there are only ``WATER`` and ``LAVA``. Custom fluids from other plugins are not supported.

This is an example recipe for extract water from a water bottle to create an empty bottle:

```js
{
  "mode": "EXTRACT",
  "fluid_type": "WATER",
  "fluid_amount": 300,
  "input": "minecraft:potion{\"Potion\": \"minecraft:water\"}", // (1)
  "result": "minecraft:glass_bottle",
  "time": 30
}
```

1. As a water bottle is not its own item, a Custom Item Format is required here. See \"Item Formats\" below for more
   information.

## Electric Brewing Stand Recipes

Using these recipes, you can configure which potion types can be created using the electric brewing stand. You're also
able to configure their ingredients, as well as multipliers for duration and amplifier level and the max amount of these
levels.

This recipe would add the luck effect type to the electric brewing stand:

```js
{
  "result": "minecraft:luck",
  "default_time": 1800, // (1)
  "redstone_multiplier": 2, // (2)
  "glowstone_multiplier": 0.5, // (3)
  "max_duration_level": 5, // (4)
  "max_amplifier_level": 5, // (5)
  "inputs": [
    "minecraft:nether_wart", // (6)
    "minecraft:grass_block"
  ]
}
```

1. The default time a potion with this effect would have. In ticks, 20 ticks = 1s. This potion would have a default time
   of 1:30
2. The time multiplier when a duration level (one redstone) is added. This means a luck potion with level two duration
   would last 3:00, level three 4:30 and so on.
3. In Minecraft, when glowstone is added to a potion in order to increase the amplifier level, the duration is reduced.
   This is represented by this multiplier. A potion with an amplifier of level two would have a duration of 0:45, level
   three 0:11 and so on.
4. The maximum allowed duration level for a potion of this effect. By default, you cannot create an effect with both an
   increased duration level and an increased amplifier level, but you are able to change this in the config file for the
   electric brewing stand.
5. The maximum allowed amplifier level for a potion of this effect. By default, you cannot create an effect with both an
   increased duration level and an increased amplifier level, but you are able to change this in the config file for the
   electric brewing stand.
6. In this recipe type, multiple item choices for one ingredient are **not** allowed.

## Item Formats

There are multiple ways for you to specify an item in a recipe:

#### Custom Item Format

This format allows you to use a custom item from Nova or any other supported plugin. For example ``itemsadder:ruby``
would also work here.

```js
"nova:advanced_cable"
```

#### Complex Item Format

This format lets you fully customize the required item. If you use this format, you won't be able to use custom
namespaces like ``nova:``  
As this checks the item exactly (only ignoring the item name), you might encounter some issues with enchantments and
other data stored inside the item.

```js
"minecraft:potion{\"Potion\": \"minecraft:water\"}" // (1)
```

1. Works exactly the same as Minecraft's /give command. As this is JSON, quotes need to be escaped.