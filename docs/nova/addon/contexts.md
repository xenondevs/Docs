!!! info "Usage of Contexts in Nova"

    Contexts are currently only used for block-related events, but it is planned to expand them
    to other aspects in the future.

A `Context`, at its core, is a simple key-value storage for `#!kotlin (ContextParamType<T>, T)` pairs and
a `ContextIntention`, which defines the allowed parameters.

You can find a list of default context intentions [here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.context.intention/-default-context-intentions/index.html).  
You can find a list of default context param types [here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.context.param/-default-context-param-types/index.html).  
The documentation also notes which types are parameter types are required for which `ContextIntention` and which are optional.

The context system can also infer parameters from other parameters, for example, you don't need to provide a
`BLOCK_WORLD` parameter if you provide a `BLOCK_POS` parameter, and you can still read `BLOCK_WORLD` from the context.
Which parameters are inferred from other parameters is also noted in the context intention documentation.

## Creating and using a Context

And this is how you create and use a `Context`:

```kotlin
// create a context to place EXAMPLE_BLOCK at pos
val context = Context.intention(DefaultContextIntentions.BlockPlace)
    .param(DefaultContextParamTypes.BLOCK_POS, pos)
    .param(DefaultContextParamTypes.BLOCK_TYPE_NOVA, Blocks.EXAMPLE_BLOCK)
    .build()

// read BLOCK_WORLD from context, which is inferred from BLOCK_POS
val world: World = context.getOrThrow(DefaultContextParamTypes.BLOCK_WORLD)

// place block
BlockUtils.placeBlock(context)
```

## Custom ContextParamType

In the example below I've created a custom `ContextParamType` that can be used in the
`BlockPlace`, `BlockBreak`, `BlockInteract` default intentions. It represents the name of the target block 
and is autofilled through either the `BLOCK_TYPE_NOVA` or `BLOCK_TYPE_VANILLA` parameter.

```kotlin
val BLOCK_NAME: ContextParamType<Component> =
    ContextParamType.builder<Component>(Machines, "block_name")
        .optionalIn(BlockPlace, BlockBreak, BlockInteract)
        .autofilledBy(DefaultContextParamTypes::BLOCK_TYPE_NOVA) { type: NovaBlock -> type.name }
        .autofilledBy(DefaultContextParamTypes::BLOCK_TYPE_VANILLA) { type: Material -> Component.translatable(type.blockTranslationKey!!) }
        .build()
```