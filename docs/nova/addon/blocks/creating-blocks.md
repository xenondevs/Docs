## Block States

Block states in Nova are quite similar to those in vanilla Minecraft. Every block type has at least one block state,
and additional block states can be added using block state properties. For example, a directional block may have four
block states for each cardinal direction, but they're all the same block type.

### Block State Properties

In Nova, block state properties a separated into `BlockStateProperty` and `ScopedBlockStateProperty`.  
`BlockStateProperty` is just used to assign an id to a type, such as `nova:facing` to the `BlockFace` enum:

```kotlin title="DefaultBlockStateProperties.kt"
val FACING: EnumProperty<BlockFace> = EnumProperty(ResourceLocation.fromNamespaceAndPath("nova", "facing"))
```

`ScopedBlockStateProperty` on the other hand defines which values are valid and how the default values are inferred
from a [block place context](../contexts.md):

```kotlin title="DefaultScopedBlockStateProperties.kt"
 /**
  * A scope for [DefaultBlockStateProperties.FACING], limited to the four horizontal directions
  * [BlockFace.NORTH], [BlockFace.EAST], [BlockFace.SOUTH] and [BlockFace.WEST].
  */
 val FACING_HORIZONTAL: ScopedBlockStateProperty<BlockFace> =
     DefaultBlockStateProperties.FACING.scope(BlockFace.NORTH, BlockFace.EAST, BlockFace.SOUTH, BlockFace.WEST) { ctx ->
         ctx[DefaultContextParamTypes.SOURCE_DIRECTION]
             ?.calculateYaw()
             ?.let { BlockFaceUtils.toCartesianFace(it) }
             ?.oppositeFace
             ?: BlockFace.NORTH
     }
 
 /**
  * A scope for [DefaultBlockStateProperties.FACING], limited to the two vertical directions [BlockFace.UP] and [BlockFace.DOWN].
  */
 val FACING_VERTICAL: ScopedBlockStateProperty<BlockFace> =
     DefaultBlockStateProperties.FACING.scope(BlockFace.UP, BlockFace.DOWN) { ctx ->
         ctx[DefaultContextParamTypes.SOURCE_DIRECTION]?.calculateYawPitch()
             ?.let { (_, pitch) -> if (pitch < 0) BlockFace.UP else BlockFace.DOWN }
             ?: BlockFace.UP
     }
```

The `ScopedBlockStateProperty` is only used for registering a block.
`BlockStateProperty` is used to retrieve a values from a `NovaBlockState`.  
This separation is useful, as it allows us to generalize all scopes for `nova:facing` into a single property, so we don't
need to check for each individual scope, but can just use `#!kotlin DefaultBlockStateProperties.FACING`

## Creating a Block Registry

Create a `BlockRegistry` singleton object and annotate it with `#!kotlin @Init` to have it loaded during addon initialization.

```kotlin
@Init(stage = InitStage.PRE_PACK) // (1)!
object Blocks : BlockRegistry by ExampleAddon.registry {
    
    // (2)!
    
}
```

1. Nova will load this class during addon initialization, causing your blocks to be registered.
2. Register your blocks here

## Creating a block

You can create a very simple block like this:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks : BlockRegistry by ExampleAddon.registry {

   val EXAMPLE_BLOCK = block("example_block") {}

}
```

This block will have no functionality and its model will default to the model defined under
`models/block/example_block.json` or alternatively a cube model with the texture `textures/block/example_block.png`.

### Defining the block model layout

To define the block model layout, use the `models` scope in the builder.

#### Model backing

First you'll need to choose how to back the block model. In Nova, you can either use existing vanilla block states
(`#!kotlin stateBacked(/*...*/)`), item display entities (`#!kotlin entityBacked(/*...*/`), or item display entities
with a custom item model definition (`#!kotlin entityItemBacked(/*...*/)`) for custom blocks.
All options have their own advantages and disadvantages, which are explained in more detail in the KDocs
([here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.resources.layout.block/-block-model-layout-builder/index.html),
[here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.resources.layout.block/-backing-state-category/index.html)).
Additionally, only tile-entities can use entity-backed models.

In the following code snippet, I chose to back the custom block via mushroom blocks:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks : BlockRegistry by ExampleAddon.registry {
    
    val EXAMPLE_BLOCK = block("example_block") {
       stateBacked(BackingStateCategory.MUSHROOM_BLOCK)
    }
}
```

#### Custom Model

To override which model is used for your block, use the `selectModel` scope to select a model for each block state:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks : BlockRegistry by ExampleAddon.registry {
    
    val EXAMPLE_BLOCK = block("example_block") {
        stateProperties(DefaultScopedBlockStateProperties.FACING_HORIZONTAL) // (1)!
        
        stateBacked(BackingStateCategory.MUSHROOM_BLOCK) { // (2)!
            val facing = getPropertyValueOrThrow(DefaultBlockStateProperties.FACING) // (3)!
            getModel(/* path */) // (4)!
        }
    }
   
}
```

1. The block will have block states for all horizontal directions.
2. This will be run for every block state.
3. You can retrieve the value of a `BlockStateProperty` and select the model accordingly.
4. Loads and returns the model under the given path.

Of course, you won't need to manually create rotated models for your blocks.
Instead, you can use the `ModelBuilder` obtained by `getModel(/*...*/)` (or `defaultModel`) in the `selectModel` scope
and use that to rotate the model:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks : BlockRegistry by ExampleAddon.registry {
    
    val EXAMPLE_BLOCK = block("example_block") {
        stateProperties(DefaultScopedBlockStateProperties.FACING_HORIZONTAL)
        
        models {
            stateBacked(BackingStateCategory.MUSHROOM_BLOCK)
            selectModel { defaultModel.rotated() } // (1)!
        }
    }
   
}
```

1. Automatically rotates your model based on `DefaultBlockStateProperties.FACING` or `DefaultBlockStateProperties.AXIS`.
   You can also rotate manually, or do other transformations such as scaling, translating or combining models using
   the `ModelBuilder`.

!!! note "Refer to the [KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.block/-nova-block-builder/index.html) for a full list of available functions and properties."

## Creating an Item for the Block

To create an item for your block, simply reference your block while registering the item in your `ItemRegistry`:

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Items : ItemRegistry by ExampleAddon.registry {
    
    val EXAMPLE_BLOCK = item(Blocks.EXAMPLE_BLOCK) {}
    
}
```

## Placing / Destroying Nova Blocks

To place or break custom blocks, you'll need a [Context](../contexts.md). Then, use `#!kotlin BlockUtils.placeBlock`,
`#!kotlin BlockUtils.breakBlock` or `#!kotlin BlockUtils.updateBlockState`.

There are extension properties available on `org.bukkit.Block` to get the `novaBlockState` or `novaBlock`.

!!! warning "Direct world access via WorldDataManager"

      You can also directly read / write to Nova's world data storage via `WorldDataManager`. However, note that setting a 
      block state via `WorldDataManager` will not perform any other logic such as tile-entity creation, calling
      block behaviors, placing the backing state, or spawning the associated display entity.