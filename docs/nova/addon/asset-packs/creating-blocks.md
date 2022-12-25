# Creating blocks

## Creating your first block material

Generally, creating a block material is very similar to [creating an item material](creating-items.md).  
If your item and block are supposed to use the same model, you don't need to do anything at all.
For example, this is how we register the Solar Panel in our Machines addon:

```json title="materials.json"
"solar_panel": "block/solar_panel"
```

## Different models for block and item

In some cases, you will need different models for block and item. An example from the Machines addon would be the
Wind Turbine. As it occupies multiple blocks, the Wind Turbine is split into 6 different (4 four the actual "pillar"
and 2 for the rotor blades) models. However, since an item cannot be a compound of multiple models, we needed to create
a separate, smaller version of the whole Wind Turbine for players to hold in their hands.
For such cases, you can separate `item` and `block:

```json title="materials.json"
"wind_turbine": {
  "item": "item/wind_turbine",
  "block": {
    "models": [
      "block/wind_turbine/0",
      "block/wind_turbine/1",
      "block/wind_turbine/2",
      "block/wind_turbine/3",
      "block/wind_turbine/rotor_middle",
      "block/wind_turbine/rotor_blade"
    ]
  }
}
```

## Block Types

The block type defines how blocks are added to the world.
Currently, there are only two types: `default` (can be omitted) and `solid`.

### Armor Stand blocks

When using the block type `default`, armor stands are used to display the block in the world.  
When this type is used, you can also configure the hitbox material with the `hitbox`. This is the material of the block
over which the custom block model will be displayed with the armor stand. By default, the hitbox type is `BARRIER`, which
comes with several benefits such as being able to use models smaller than the block itself but also not having to set
the armor stand on fire.

??? question "Why are non-barrier armor stands on fire?"

    Because of the way Minecraft's lightning works, some block types will cause the armor stand
    to be rendered completely black, as it is inside the block and no light gets through. Nova automatically deals with these
    kinds of blocks and sets the armor stand on fire (the fire is not visible to the player as the armor stand is invisible),
    but this is still not optimal as the block will always be rendered at full brightness, which is especially noticeable
    in dark areas, at night or when using shaders. Therefore, it is recommended to stick to the barrier block or to use a
    similar material which also doesn't block any light.

### Solid blocks

Solid blocks are real blocks in the world, whose block state does not appear in the world or have been made by Nova to
not appear in the world (For example note block instruments are sent to the client, but are not required for their
functionality).  
When using the block type `solid`, Nova automatically chooses one of the four available solid block options, depending
on availability:  

| Block Type           | Amount available |
|----------------------|------------------|
| Note Block           | 1149             |
| Red Mushroom Block   | 63               |
| Brown Mushroom Block | 63               |
| Mushroom Stem        | 63               |
|                      |                  |
| Total                | 1338             |

In total, 988 blocks can be registered as `solid`. If there are no more blocks available, Nova will fall back to armor
stand blocks.

#### directions

If your block is directional, you will need to register that under the `directions` property. Each direction takes up
one block state, so a normal directional block will take up four block states and a block that can also be rotated to look
up or down will take up six block states.  
The `directions` property accepts a string with the chars `n`, `e`, `s`, `w`, `u`, `d` representing the directions `north`,
`east`, `south`, `west`, `up`, `down`.  
The order is irrelevant.  
```json title="materials.json - Directional solid block for North, East, South, West"
"quarry": {
  "item": "block/quarry",
  "block": {
    "type": "solid",
    "directions": "nesw"
  }
}
```

!!! abstract "`directions`"

    The `directions` property is only required for blocks of type `solid`, as Nova needs to generate the block states
    for those rotations. Armor stand blocks do not need this property since armor stands can just be rotated.

#### priority

Because the supply of solid bocks is limited, you can set a priority for your material to become a solid block.  
The blocks with the highest priority will become solid blocks.  
In general, the priority should be an estimation of how many blocks of this type will be in a chunk.

!!! info

    If you want to learn more about the concepts behind custom blocks, consider checking out our
    [spigot thread about it](https://www.spigotmc.org/threads/520187/).