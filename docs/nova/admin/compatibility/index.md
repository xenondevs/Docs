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

Checked plugins are fully supported (e.g. their items can be used in recipes, their blocks can be broken by machines, etc.)  
Unchecked plugins are partially supported, some features might not work.

- [x] [ItemsAdder](itemsadder.md) | [Known Issues](itemsadder.md#known-issues)
- [x] [Oraxen](oraxen.md) | [Known Issues](oraxen.md#known-issues)
- [ ] MMOItems

Planned:

* [Slimefun](utp.md)
* [Space](utp.md)

!!! warning

    Most of these plugins require [resource pack merging](../setup.md#optional-resourcepack-merging).  
    You might also want to check out the [troubleshooting page](troubleshooting.md).

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