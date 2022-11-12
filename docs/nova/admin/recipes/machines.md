# Recipe Types from the Machines Addon

## Pulverizer Recipes

This is an example recipe for pulverizing iron ore into iron dust:

```json title="iron_ore_to_iron_dust.json"
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

## Mechanical Press Recipes

Recipes for the mechanical press are grouped in the sub-folders ``gear/`` and ``plate/``  
Both use the same syntax.  
This is an example recipe for pressing an iron plate:

```json title="iron_ingot_to_iron_plate.json"
{
  "input": "minecraft:iron_ingot",
  "result": "machines:iron_plate",
  "time": 200
}
```

!!! info "Multiple Choices for Ingredients"

    If you want to give players multiple item choices for a single ingredient, you can specify an array of strings instead of a single string for the input.

## Fluid Infuser Recipes

The Fluid Infuser can be used in two modes: Inserting fluids into an item or extract fluids from an item.  
This is an example recipe for inserting water into a bucket to create a water bucket:

```json title="bucket_to_water_bucket.json"
{
  "mode": "INSERT",
  "fluid_type": "WATER",
  "fluid_amount": 1000,
  "input": "minecraft:bucket",
  "result": "minecraft:water_bucket",
  "time": 100
}
```
!!! abstract "Parameters"

    === "Mode"

        The mode specifies if this should be a recipe for inserting (``INSERT``) or extracting (``EXTRACT``) fluids.

    === "Fluid Type"

        Currently, there are only ``WATER`` and ``LAVA``. Custom fluids from other plugins are not supported.

This is an example recipe for extract water from a water bottle to create an empty bottle:

```json title="potion_to_glass_bottle.json"
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

    As a water bottle is not its own item, a [Complex Item Format](index.md#complex-item-format) is required here.

## Electric Brewing Stand Recipes

Using these recipes, you can configure which potion types can be created using the electric brewing stand. You're also
able to configure their ingredients, as well as multipliers for duration and amplifier level and the max amount of these
levels.

This recipe would add the luck effect type to the electric brewing stand:

```json title="luck.json"
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

!!! abstract "Parameters"

    === "default_time"

        The default time a potion with this effect would have. In ticks, 20 ticks = 1s. This potion would have a default time of 1:30

    === "redstone_multiplier"

         The time multiplier when a duration level (one redstone) is added. This means a luck potion with level two duration would last 3:00, level three 4:30 and so on.

    === "glowstone_multiplier"

        In Minecraft, when glowstone is added to a potion in order to increase the amplifier level, the duration is reduced. This is represented by this multiplier. A potion with an amplifier of level two would have a duration of 0:45, level three 0:11 and so on.

    === "max_duration_level"

        The maximum allowed duration level for a potion of this effect. By default, you cannot create an effect with both an increased duration level and an increased amplifier level, but you are able to change this in the config file for the electric brewing stand.

    === "max_amplifier_level"

        The maximum allowed amplifier level for a potion of this effect. By default, you cannot create an effect with both an increased duration level and an increased amplifier level, but you are able to change this in the config file for the electric brewing stand.

!!! info "Multiple Choices for Ingredients"

    In this recipe type, multiple item choices for one ingredient are **not** allowed.
