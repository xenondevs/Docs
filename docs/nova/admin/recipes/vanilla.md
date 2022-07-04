# Vanilla Recipe Types

## Shaped Recipes

Shaped recipes are recipes for the Crafting Table that have to follow a specific structure. This is an example crafting
recipe for the Advanced Cable:

```json title="advanced_cable.json"
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

!!! abstract "Parameters"

    === "shape"

        The shape is the structure of the recipe. You can see that it resembles a Crafting Table. The letters you use here have to  also be present in the ``ingredients`` section. You can use a space if that slot should be empty.

    === "amount"

        The amount of items that will be crafted, can be omitted for 1.


!!! info "Multiple Choices for Ingredients"

     If you want to give players multiple item choices for a single ingredient, you can specify an array of strings instead of a single string for each ingredient.

## Shapeless Recipes

Shapeless recipes are recipes for the Crafting Table that do not follow a specific structure. This is an example recipe
for the Basic Item Filter:

```json title="basic_item_filter.json"
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

```json title="basic_item_filter.json"
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

## Furnace Recipes

This is an example recipe for smelting iron dust into iron ingots:

```json title="iron_dust_to_iron_ingot.json"
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