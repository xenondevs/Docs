## Compatible server software

Nova is a paper plugin and needs to be run on a paper server or paper fork. Officially supported are:

* [x] [Paper](https://github.com/PaperMC/Paper) (recommended)
* [x] [Purpur](https://github.com/PurpurMC/Purpur)
* [x] [Pufferfish](https://github.com/pufferfish-gg/Pufferfish)

Any other server software may or may not work properly with Nova.  

We're planning to add support for the following server software in the future:

* [Folia](https://github.com/PaperMC/Folia)

## Compatibility with other plugins

### Custom Item Plugins

- [ItemsAdder](itemsadder.md)
- [Nexo](nexo.md) | [Known Issues](nexo#known-issues)
- MMOItems

!!! warning

    Most of these plugins require [resource pack merging](../setup.md#optional-resourcepack-merging).

### World Protection Plugins

The following protection plugins are supported out of the box by Nova, but plugin developers may also
add support on their end using [the API](../../api/protection/protectionintegration.md).

- [x] WorldGuard
- [x] GriefPrevention
- [x] PlotSquared
- [x] Towny
- [x] ProtectionStones
- [x] QuickShop
- [x] Residence

## Incompatible Plugins

The following plugins cannot be used with Nova:

- [FastAsyncWorldEdit](https://www.spigotmc.org/resources/13932/) - Please consider using normal [WorldEdit](https://dev.bukkit.org/projects/worldedit) instead.