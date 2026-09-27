---
icon: lucide/square-function
---

# Contexts

A `#!kotlin Context<I : ContextIntention<I>>`, at its core, is a simple key-value storage for `#!kotlin (ContextParamType<T, I>, T)` pairs and a `ContextIntention`, which defines their allowed parameter types.

The context system can also infer parameters from other parameters, for example, you don't need to provide a `BLOCK_WORLD` parameter if you provide a `BLOCK` parameter, and you can still read `BLOCK_WORLD` from the context.

You can find a list of default context intentions [here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.context.intention/index.html). Each context intention object contains their allowed parameter types as properties and documents which autofillers (which infer context parameter values) are available.

## Creating and using a Context

And this is how you create and use a `Context`:

```kotlin
// create context
val ctx: Context<BlockPlace> = Context.intention(BlockPlace /* (1)! */)
    .param(BlockPlace.BLOCK, block)
    .param(BlockPlace.BLOCK_TYPE, Blocks.EXAMPLE_BLOCK.get())
    .build()

// read from context
val world: World = ctx[BlockPlace.BLOCK_WORLD] // (2)!
val whoPlaced: Player? = ctx[BlockPlace.SOURCE_PLAYER] // (3)!

// context usage: place block
BlockUtils.placeBlock(ctx)
```

1. The `ContextIntention` `BlockPlace` specifies the set of allowed context param types that are available, for example `BlockPlace.BLOCK` or `BlockPlace.BLOCK_TYPE`. It also specifies how context parameter values can be inferred from each other, for example, `BLOCK_WORLD` can be inferred from the Bukkit `BLOCK`.

2. This reads the `BLOCK_WORLD` parameter from the context, which is inferred from the provided `BLOCK` parameter. Since `BLOCK_WORLD` is a required parameter for the `BlockPlace` intention, we can be sure that it is present in the context and thus non-null.

3. This reads the `SOURCE_PLAYER` parameter from the context, which is optional for the `BlockPlace` intention. The returned value is nullable as it is not a required parameter type in this intention. In this specific case, the player will be null because no suitable parameter that could be used to infer the player (like `SOURCE_UUID`) was defined.

## Custom ContextParameterType

You can register a custom parameter type for an intention like this:

```kotlin
val BLOCK_NAME = BlockPlace.addOptionalParamType<Component>()
```

For required parameters, use `addRequiredParamType`:

```kotlin
val BLOCK_NAME = BlockPlace.addRequiredParamType<Component>()
```

If your parameter should have a default value, use `addDefaultingParamType`

```kotlin
val BLOCK_NAME = BlockPlace.addDefaultingParamType<Component>(default = Component.empty())
```

## Custom Autofiller

Once you have registered a custom parameter type, you may also want to register an autofiller for it. This can be done via `ContextIntention.addAutofiller`:

```kotlin
BlockPlace.addAutofiller(
    BLOCK_NAME,
    Autofiller.from(BlockPlace.BLOCK_TYPE) { type: BlockType ->
        Component.text(type.toString())
    }
)
```

## Custom ContextIntention

Of course, you can also create a completely custom `ContextIntention`. For that, create a singleton object that inherits from `AbstractContextIntention`:

```kotlin
object MyIntention : AbstractContextIntention<MyIntention>() {

    val BLOCK = addRequiredParamType<Block>()
    val BLOCK_WORLD = addRequiredParamType<World>()
    val BLOCK_NAME = addRequiredParamType<Component>()

    init {
        addAutofiller(BLOCK_WORLD, Autofiller.from(BLOCK, Block::getWorld))
    }

}
```