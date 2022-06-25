# Registering Materials

!!! info

    Currently, every block in Nova is automatically a TileEntity. So creating ores or other non interactable blocks is not
    supported yet. Normal blocks will be added in the future which will also include real blocks instead of ArmorStands
    like note blocks and mushroom blocks.

## Time and Place of Registration

The registration is pretty similar to the [item registration](../items/registering-materials.md). Create
the [block assets](../asset-packs/creating-blocks.md)
and create a `Blocks` singleton object that contains all `BlockNovaMaterial` of your addon. All materials need to be
registered when `Addon#init` is called, materials registered later won't work properly. Similar to the `Items` singleton
object, your singleton object might then look like this:

```kotlin
object Blocks {
    
    // we will register blocks here later
    
    fun init() = Unit

}
```

Now add the init call to your main class:

```kotlin
object MyAddon : Addon() {
    
    override fun init() {
        Items.init()
        Blocks.init()
    }
    
    override fun onEnable() = Unit
    override fun onDisable() = Unit

}
```

Again, calling the init function will cause the class and all its fields to be loaded.

## Creating BlockOptions

Before registering a new TileEntity, you need to create a `BlockOptions` instance. This class contains properties for
breaking/placing custom blocks. Let's create an instance that can be broken with a stone pickaxe:

```kotlin
val STONE = BlockOptions(
    3.0, // (1)
    ToolCategory.PICKAXE, // (2)
    ToolLevel.STONE, // (3)
    true, // (4)
    Material.BARRIER, // (5)
    SoundEffect(Sound.BLOCK_STONE_PLACE), // (6)
    SoundEffect(Sound.BLOCK_STONE_BREAK), // (7)
    Material.NETHERITE_BLOCK, // (8)
    true // (9)
)
```

1. This is the hardness of the block. It determines how long it takes to break the block. This value currently doesn't affect explosions.
2. The type of tool that can break this block.
3. The minimum ``ToolLevel`` that is required to properly break this block (Like diamond for obsidian).
4. Whether a tool is required to receive drops.
5. The material for the hitbox of the block.
6. The sound that plays when the block is placed.
7. The sound that plays when the block is broken.
8. The break particles that spawn when the block is broken.
9. (optional) Whether a break animation should be displayed while breaking the block.