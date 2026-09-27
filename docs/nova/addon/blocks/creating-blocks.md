---
icon: lucide/box
---

# Creating Blocks

## Block States

Block states in Nova are quite similar to those in vanilla Minecraft. Every block type has at least one block state, and additional block states can be added using block state properties. For example, a directional block may have four block states for each cardinal direction, but they're all the same block type.

### Block State Properties

A `BlockStateProperty` describes a property of a block, such the direction it faces. Each property defines its possible values and how a value is chosen when a block is placed:

```kotlin title="DefaultBlockStateProperties.kt"
val FACING_VERTICAL: BlockStateProperty<BlockFace> =
    EnumProperty(Key.key("nova", "facing"), BlockFace.UP, BlockFace.DOWN) { ctx ->
        ctx.resolve(BlockPlace.SOURCE_DIRECTION)?.calculateYawPitch()
            ?.let { [_, pitch] -> if (pitch < 0) BlockFace.UP else BlockFace.DOWN }
            ?: BlockFace.UP
    }
```

## Creating a Block Registry

Create a singleton object and annotate it with `#!kotlin @Init` to have it loaded during addon initialization.

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Blocks {
    
    // (2)!
    
}
```

1. Nova will load this class during addon initialization, causing your blocks to be registered.
2. Register your blocks here

## Creating a block

You can create a very simple block like this:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks {

   val EXAMPLE_BLOCK = ExampleAddon.block("example_block") {}

}
```

This block will have no functionality and its model will default to the model defined under `models/block/example_block.json` or alternatively a cube model with the texture `textures/block/example_block.png`.

### Defining the block model layout

To define the block model layout, use `stateBacked`, `entityBacked`, or `entityItemBacked` in the builder.

#### Model backing

First you'll need to choose how to back the block model. In Nova, you can either use existing vanilla block states (`#!kotlin stateBacked(/*...*/)`), item display entities (`#!kotlin entityBacked(/*...*/)`), or item display entities with a custom item model definition (`#!kotlin entityItemBacked(/*...*/)`) for custom blocks. All options have their own advantages and disadvantages, which are explained in more detail in the KDocs ([here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.registry/-nova-block-builder/index.html), [here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.resources.builder.layout.block/-backing-state-category/index.html)).

In the following code snippet, I chose to back the custom block via mushroom blocks:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks {
    
    val EXAMPLE_BLOCK = ExampleAddon.block("example_block") {
       stateBacked(BackingStateCategory.MUSHROOM_BLOCK)
    }
}
```

#### Custom Model

To override which model is used for your block, pass a model selector to `#!kotlin stateBacked` or `#!kotlin entityBacked` to select a model for each block state:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks {
    
    val EXAMPLE_BLOCK = ExampleAddon.block("example_block") {
        stateProperties(DefaultBlockStateProperties.FACING_HORIZONTAL) // (1)!
        
        stateBacked(BackingStateCategory.MUSHROOM_BLOCK) { // (2)!
            val facing = getPropertyValueOrThrow(DefaultBlockStateProperties.FACING_HORIZONTAL) // (3)!
            getModel(/* path */) // (4)!
        }
    }
   
}
```

1. The block will have block states for all horizontal directions.
2. This will be run for every block state.
3. You can retrieve the value of the registered `BlockStateProperty` and select the model accordingly.
4. Loads and returns the model under the given path.

Of course, you won't need to manually create rotated models for your blocks. Instead, you can use the `ModelBuilder` obtained by `getModel(/*...*/)` (or `defaultModel`) in the model selector and use that to rotate the model:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks {
    
    val EXAMPLE_BLOCK = ExampleAddon.block("example_block") {
        stateProperties(DefaultBlockStateProperties.FACING_HORIZONTAL)
        
        stateBacked(BackingStateCategory.MUSHROOM_BLOCK) {
           defaultModel.rotated() // (1)!
        }
    }
   
}
```

1. Automatically rotates your model based on a registered facing or axis property from `DefaultBlockStateProperties`. You can also rotate manually, or do other transformations such as scaling, translating or combining models using the `ModelBuilder`.

!!! note "Refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.registry/-nova-block-builder/index.html) for a full list of available functions and properties."

## Creating an Item for the Block

To create an item for your block, simply reference your block while registering the item:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items {
    
    val EXAMPLE_BLOCK = ExampleAddon.item(Blocks.EXAMPLE_BLOCK) {}
    
}
```

## Placing / Destroying Nova Blocks

To place or break custom blocks, you'll need a [Context](../contexts.md). Then, use `#!kotlin BlockUtils.placeBlock` or `#!kotlin BlockUtils.breakBlock`.

There are extension properties available on `org.bukkit.block.Block` to get the `blockType`, `novaBlockState`, or `novaTileEntity`.

To change a block state property, modify the `NovaBlockState` and apply it back to the block:

```kotlin
val state = block.novaBlockState ?: return
state[DefaultBlockStateProperties.FACING_HORIZONTAL] = BlockFace.NORTH
block.blockData = state
```

Inside a tile-entity, use `updateBlockState` to apply the modified `blockState` instead.
