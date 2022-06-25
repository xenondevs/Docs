# Creating blocks

## Creating your first block material

Generally, creating a block material is very similar to [creating an item material](creating-items.md).  
If your item and block are supposed to use the same model, you don't need to do anything at all.
For example, this is how we register the Solar Panel in our Machines addon:

```json
"solar_panel": "block/solar_panel"
```

## Different models for block and item

In some cases, you will need different models for block and item. An example from the Machines addon would be the
Wind Turbine. As it occupies multiple blocks, the Wind Turbine is split into 6 different (4 four the actual "pillar"
and 2 for the rotor blades). However, since we can only display one model at a time on an item, it was also required to
create a smaller version of the whole Wind Turbine for players to hold in their hands.  
In such a case, you can separate `item` and `block`:

```json
"item": "item/wind_turbine",
"block": [
  "block/wind_turbine/0",
  "block/wind_turbine/1",
  "block/wind_turbine/2",
  "block/wind_turbine/3",
  "block/wind_turbine/rotor_middle",
  "block/wind_turbine/rotor_blade"
]
```

## `item_type` and `block_type`

The different item types from [Creating Items](creating-items.md#item-types) can also be set for the block models, as our current
custom blocks are all armor stands and therefore also just use items.

!!! warning

    This will probably change in the future, when support for different block model providers such as mushroom or note
    block is added.