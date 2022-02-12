# Main Config

Nova's main config is located under ``plugins/Nova/config/config.json``

## Resource Pack

Here you can specify if and which resource pack players should receive when joining the server.

```json
"resource_pack": {
  "enabled": true,
  "url": "https://github.com/xenondevs/NovaRP/releases/download/0.8/NovaRP.zip"
}
```

## Tile-Entity Limits

You are also able to limit which tile-entities can be used where and how many of them players are allowed to place.  
The following configuration would disallow all tile-entities in the nether, prevent players from placing Quarries in the
end and limit Quarries to 1 per player.  
It is possible to bypass these restrictions with the permission ``nova.misc.bypassTileEntityLimits``.

```json
"tile_entity_world_blacklist": [
  "world_nether"
],
"tile_entity_type_world_blacklist": {
  "QUARRY": [
    "world_the_end"
  ]
},
"tile_entity_limit": {
  "QUARRY": 1
}
```

## Upgrade Modifiers

These are the default upgrade modifiers for all machines. The amount of numbers in the arrays also specifies how many
upgrades can be used.  
Note, that the ``range`` modifier does not accept decimal numbers.

```json
"upgrade_modifiers": {  
  "speed": [1.0, 1.91, 2.82, 3.73, 4.64, 5.55, 6.46, 7.37, 8.28, 9.19, 10.0],
  "efficiency": [1.0, 1.25, 1.75, 2.75, 3.75, 4.75, 5.75, 6.75, 7.75, 8.75, 9.75],
  "energy": [1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1, 10.0],
  "fluid": [1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1, 10.0],
  "range": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

## Render Distance

Configures the render distance (in chunks) of armor stands spawned by Nova.  
Players will be able to select a render distance between ``min`` and ``max`` in-game.  
The render distance is also limited by the game itself, so there is no benefit in turning this past a certain value.
Huge render distances will crash your server.

```json
"armor_stand_render_distance": {
  "min": 1,
  "max": 6,
  "default": 4
}
```

## Mob Catcher Blacklist

Specifies which mobs cannot be captured with a Mob Catcher.

```json
"bottled_mob_blacklist": [
  "WITHER",
  "ENDER_DRAGON",
  "ELDER_GUARDIAN"
]
```

## Default Transfer Rates

When blocks are adjacent to each other, they can still transfer energy, items and fluids without a cable between them.
These speeds can be configured here:

```json
"network": {
  "energy": {
    "default_transfer_rate": 9223372036854775807
  },
  "item": {
    "default_transfer_rate": 2147483647
  },
  "fluid": {
    "default_transfer_rate": 9223372036854775807
  }
}
```
!!! info

    If you're looking to change the transfer rates of cables, these are configured in the individual cable configs.

## Performance Options

This specifies if blocks like the Quarry or harvest should drop items on the ground once their inventory is full. If
this is set to false, the machine will continue working until **all** slots in their inventory are full. Items that
can't be added will be deleted.

```json
"machines_drop_excess_on_ground": true
```

With this option, you can configure if sounds should be played and particles should be displayed when machines like the
Quarry or Block Breaker destroy blocks.

```json
"disable_block_break_effects": false
```

## Advanced Options

### MySQL

If you want to, you can connect to a database instead of using sqlite.

```json
"mysql": {
  "enabled": false,
  "address": "localhost",
  "port": 3306,
  "username": "",
  "password": "",
  "database": ""
},
```

### Nova Executor

The Nova Executor is used for executing tasks asynchronously. Here you can specify how many threads should be used. You
can also completely disable it and switch back to Bukkit's Scheduler system.

```json
"nova_executor": {
  "enabled": true,
  "threads": 200
}
```

### Crafting

If you're experiencing issues with custom crafting recipes from different plugins not working, try
setting ``allow_result_overwrite`` to ``true``.

```json
"crafting": {
  "allow_result_overwrite": false
}
```

### Other

``chunk_reload_watcher`` will notify you when chunks are reloaded repeatedly. You should enable this option before
reporting any chunk-loading related bugs.  
``use_metric_prefixes`` lets you switch back to the old system for displaying energy and fluids
