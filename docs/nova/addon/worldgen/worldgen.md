# World Generation Overview

Nova's worldgen is completely based on [Minecraft's custom worldgen format](https://minecraft.wiki/w/Custom_world_generation) with
some additions. However, you can also register everything worldgen-related in code if you don't want to use Json. If you 
do decide to use Json files, make sure to create a `data/worldgen` directory in your addon's resources folder before you 
start. This is where all your worldgen files will be stored.

Below you'll find a quick overview of the format how to use it. Check the sidebar for more detailed information.

### Structures

Structures are used to generate structures or connected structures in the world (e.g. jungle temple, villages, etc.).  
**Currently not fully supported.**

### Features
<small>Check out the [`Features` Overview](features/features.md) page for more information.</small>

Features (sometimes also called decorators) are used to add additional decorations to the world (e.g. trees, ores, etc.).

### Carvers
<small>Check out the [`Carvers` Overview](carver.md) page for more information.</small>

Carvers are used to carve out caves and ravines in the world.

### Noise

Noise setting are responsible for generating the terrain of worlds and determines which blocks to use. Because Nova's region
file format is currently pretty inefficient, these settings aren't currently supported.

### Biomes
<small>Check out the [`Biomes`](biome.md) and [`BiomeInjections`](inject/biome.md) page for more information.</small>

Biomes are regions in the world with distinct [features](features/features.md), [carvers](carver.md), 
[climate](biome.md#climate), [effects](biome.md#special-effects) and much more.

If you want to add `PlacedFeatures` to an already existing biome, check out the [`BiomeInjections`](inject/biome.md) page.

### Custom Dimensions

**TODO**