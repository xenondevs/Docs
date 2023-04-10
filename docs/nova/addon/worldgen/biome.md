# Biomes

!!! warning

    This worldgen page is still a work in progress. Some Json formats/code examples/features might be missing and will be
    added in the future. Custom biomes also aren't fully supported yet. Injecting them into `LevelStems` has to be done
    manually for now.

Biomes are regions in the world with distinct [features](features/features.md), [carvers](carver.md), [climate](#climate),
[effects](#special-effects) and much more. This page only covers the `BiomeBuilder` for now. If you're looking for the Json
format, check out the [Minecraft Wiki](https://minecraft.fandom.com/wiki/Custom_biome).

First, let's get into more detail on the individual components of a biome.

### Climate

As the name suggests, `ClimateSettings` determine the climate of a biome. I.e. the weather, snow behavior and temperature.  
The `BiomeClimateSettingsBuilder` class provides a fluent API for creating `ClimateSettings`.

### Special effects

The `BiomeSpecialEffects` determine the general look of a biome, including its fog, foliage, water and sky color or even
ambient particles. These effects also include the ambient sounds of the biome. Check out The `BiomeSpecialEffectsBuilder`
kdoc for more information.

### Mob spawn settings

The `MobSpawnSettings` determine the mobs and their spawn conditions of a biome. Check out the `MobSpawnSettingsBuilder`
kdoc for more information.

# Example

```kotlin title="Biomes.kt"
@OptIn(ExperimentalWorldGen::class)
@Init
object Biomes : BiomeRegistry by ExampleAddon.registry {
    
    private val MISC_ORES = listOf(OrePlacements.ORE_DIRT, OrePlacements.ORE_GRAVEL, OrePlacements.ORE_GRANITE_UPPER, OrePlacements.ORE_GRANITE_LOWER, OrePlacements.ORE_DIORITE_UPPER, OrePlacements.ORE_DIORITE_LOWER, OrePlacements.ORE_ANDESITE_UPPER, OrePlacements.ORE_ANDESITE_LOWER, OrePlacements.ORE_TUFF)
    private val MINERAL_ORES = listOf(OrePlacements.ORE_COAL_UPPER, OrePlacements.ORE_COAL_LOWER, OrePlacements.ORE_IRON_UPPER, OrePlacements.ORE_IRON_MIDDLE, OrePlacements.ORE_IRON_SMALL, OrePlacements.ORE_GOLD, OrePlacements.ORE_GOLD_LOWER, OrePlacements.ORE_REDSTONE, OrePlacements.ORE_REDSTONE_LOWER, OrePlacements.ORE_DIAMOND, OrePlacements.ORE_DIAMOND_LARGE, OrePlacements.ORE_DIAMOND_BURIED, OrePlacements.ORE_LAPIS, OrePlacements.ORE_LAPIS_BURIED, OrePlacements.ORE_COPPER)
    private val DECORATION_ORES = listOf(CavePlacements.UNDERWATER_MAGMA, MiscOverworldPlacements.DISK_SAND, MiscOverworldPlacements.DISK_CLAY, MiscOverworldPlacements.DISK_GRAVEL)
    
    val PLAINS = biome("plains")
        .carvers(Carving.AIR, Carvers.CAVE, Carvers.CAVE_EXTRA_UNDERGROUND, Carvers.CANYON)
        .features(Decoration.LAKES, MiscOverworldPlacements.LAKE_LAVA_SURFACE, MiscOverworldPlacements.LAKE_LAVA_UNDERGROUND)
        .feature(Decoration.LOCAL_MODIFICATIONS, CavePlacements.AMETHYST_GEODE)
        .features(Decoration.UNDERGROUND_STRUCTURES, CavePlacements.MONSTER_ROOM, CavePlacements.MONSTER_ROOM_DEEP)
        .features(Decoration.UNDERGROUND_ORES, *(MISC_ORES + MINERAL_ORES + DECORATION_ORES).toTypedArray())
        .features(Decoration.FLUID_SPRINGS, MiscOverworldPlacements.SPRING_LAVA, MiscOverworldPlacements.SPRING_WATER)
        .features(Decoration.VEGETAL_DECORATION, CavePlacements.GLOW_LICHEN, VegetationPlacements.PATCH_TALL_GRASS_2, VegetationPlacements.TREES_PLAINS, VegetationPlacements.FLOWER_PLAINS, VegetationPlacements.PATCH_GRASS_PLAIN, VegetationPlacements.BROWN_MUSHROOM_NORMAL, VegetationPlacements.RED_MUSHROOM_NORMAL, VegetationPlacements.PATCH_SUGAR_CANE, VegetationPlacements.PATCH_PUMPKIN)
        .feature(Decoration.TOP_LAYER_MODIFICATION, MiscOverworldPlacements.FREEZE_TOP_LAYER)
        .climateSettings {
            downfall(.4f)
            hasPrecipitation(true)
            temperature(.8f)
        }
        .specialEffects {
            fogColor(0xC0D8FF)
            skyColor(0x78A7FF)
            waterColor(0x3F76E4)
            waterFogColor(0x050533)
            ambientMoodSound {
                blockSearchExtent(8)
                soundPositionOffset(2.0)
                soundEvent(SoundEvents.AMBIENT_CAVE)
                tickDelay(6000)
            }
        }
        .mobSpawnSettings {
            addSpawn(MobCategory.AMBIENT, EntityType.BAT, minGroupSize = 8, maxGroupSize = 8, weight = 10)
            
            addSpawn(MobCategory.CREATURE, EntityType.SHEEP, minGroupSize = 4, maxGroupSize = 4, weight = 12)
            addSpawn(MobCategory.CREATURE, EntityType.PIG, minGroupSize = 4, maxGroupSize = 4, weight = 10)
            addSpawn(MobCategory.CREATURE, EntityType.CHICKEN, minGroupSize = 4, maxGroupSize = 4, weight = 10)
            addSpawn(MobCategory.CREATURE, EntityType.COW, minGroupSize = 4, maxGroupSize = 4, weight = 8)
            addSpawn(MobCategory.CREATURE, EntityType.HORSE, minGroupSize = 2, maxGroupSize = 6, weight = 5)
            addSpawn(MobCategory.CREATURE, EntityType.DONKEY, minGroupSize = 1, maxGroupSize = 3, weight = 1)
            
            addSpawn(MobCategory.MONSTER, EntityType.SPIDER, minGroupSize = 4, maxGroupSize = 4, weight = 100)
            addSpawn(MobCategory.MONSTER, EntityType.ZOMBIE, minGroupSize = 4, maxGroupSize = 4, weight = 95)
            addSpawn(MobCategory.MONSTER, EntityType.ZOMBIE_VILLAGER, minGroupSize = 1, maxGroupSize = 1, weight = 5)
            addSpawn(MobCategory.MONSTER, EntityType.SKELETON, minGroupSize = 4, maxGroupSize = 4, weight = 100)
            addSpawn(MobCategory.MONSTER, EntityType.CREEPER, minGroupSize = 4, maxGroupSize = 4, weight = 100)
            addSpawn(MobCategory.MONSTER, EntityType.SLIME, minGroupSize = 4, maxGroupSize = 4, weight = 100)
            addSpawn(MobCategory.MONSTER, EntityType.ENDERMAN, minGroupSize = 1, maxGroupSize = 4, weight = 10)
            addSpawn(MobCategory.MONSTER, EntityType.WITCH, minGroupSize = 1, maxGroupSize = 1, weight = 5)
            
            addSpawn(MobCategory.WATER_CREATURE, EntityType.GLOW_SQUID, minGroupSize = 4, maxGroupSize = 6, weight = 10)
        }
        .register()

}
```