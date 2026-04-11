A `#!kotlin Context<I : ContextIntention>`, at its core, is a simple key-value storage for `#!kotlin (ContextParamType<T, I>, T)` pairs and
a `ContextIntention`, which defines their allowed parameter types.

The context system can also infer parameters from other parameters, for example, you don't need to provide a
`BLOCK_WORLD` parameter if you provide a `BLOCK_POS` parameter, and you can still read `BLOCK_WORLD` from the context.

You can find a list of default context intentions [here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.context.intention/index.html). Each context intention object contains their allowed parameter types as properties and documents which autofillers (which infer context parameter values) are available.

## Creating and using a Context

And this is how you create and use a `Context`:

```kotlin
// create context
val ctx: Context<BlockPlace> = Context.intention(BlockPlace /* (1)! */)
    .param(BlockPlace.BLOCK_POS, pos)
    .param(BlockPlace.BLOCK_TYPE_NOVA, Blocks.EXAMPLE_BLOCK)
    .build()

// read from context
val world: World = ctx[BlockPlace.BLOCK_WORLD] // (2)!
val whoPlaced: Player? = ctx[BlockPlace.SOURCE_PLAYER] // (3)!

// context usage: place block
BlockUtils.placeBlock(context)
```

1. The `ContextIntention` `BlockPlace` specifies the set of allowed context param types that are available, for example `BlockPlace.BLOCK_POS` or `BlockPlace.BLOCK_TYPE_NOVA`. It also specifies how context parameter values can be inferred from each other, for example, `BLOCK_WORLD` can be inferred from `BLOCK_POS`.

2. This reads the `BLOCK_WORLD` parameter from the context, which is inferred from the provided `BLOCK_POS` parameter. Since `BLOCK_WORLD` is a required parameter for the `BlockPlace` intention, we can be sure that it is present in the context and thus non-null.

3. This reads the `SOURCE_PLAYER` parameter from the context, which is optional for the `BlockPlace` intention. The returned value is nullable as it is not a required parameter type in this intention. In this specific case, the player will be null because no suitable parameter that could be used to infer the player (like `SOURCE_UUID`) was defined.

## Generic ContextIntention parameters

The built-in context intentions split their parameter types into reusable interfaces. For example, `BlockPlace` implements `HasRequiredBlock`, which is responsible for parameter types like `BLOCK_POS` and `BLOCK_WORLD` and their autofillers. In some cases, you may want to write a function that generically accepts any intention that implements `HasRequiredBlock`. This can be done like so:

```kotlin
fun <I : HasRequiredBlock<I>> doSomethingWithBlock(ctx: Context<I>) {
    val world: World = ctx[HasRequiredBlock.blockWorld()]
    // ...
}
```

## Custom ContextParameterType

You can create a custom parameter type tied to a specific intention like this:

```kotlin
val BLOCK_NAME = ContextParamType<Component, BlockPlace>(
    Key.key(ExampleAddon, "block_name")
)
```

For required parameters, create a `RequiredParamType` instead:

```kotlin
val BLOCK_NAME = RequiredContextParamType<Component, BlockPlace>(
    Key.key(ExampleAddon, "block_name")
)
```

In this case, you will also need to register it as a required parameter type for the `BlockPlace` intention.
Otherwise, context builders will not validate whether your required parameter type is present on build.

```kotlin
BlockPlace.require(BLOCK_NAME)
```

## Custom Autofiller

Once you have created a custom `ContextParamType`, you may also want to register an autofiller for it. This can be done via `ContextIntention.addAutofiller`:

```kotlin
BlockPlace.addAutofiller(
    BLOCK_NAME,
    Autofiller.from(
        BlockPlace.BLOCK_TYPE_NOVA
    ) { type: NovaBlock -> type.name }
)

BlockPlace.addAutofiller(
    BLOCK_NAME,
    Autofiller.from(
        BlockPlace.BLOCK_TYPE_VANILLA
    ) { type: BlockType -> Component.translatable(type.translationKey()) }
)
```

## Custom ContextIntention

Of course, you can also create a completely custom `ContextIntention`. For that, create a singleton object that inherits from `AbstractContextIntention`:

```kotlin 
object MyIntention : AbstractContextIntention<MyIntention>() {
    
    val BLOCK_NAME = RequiredContextParamType<Component, MyIntention>(
        Key.key(MyAddon, "block_name")
    )
    
    init {
        require(BLOCK_NAME)
    }
    
}
```

You can also use Nova's built-in intention interfaces to reuse their parameters and autofillers:

```kotlin 
object MyIntention : AbstractContextIntention<MyIntention>(), HasRequiredBlock<MyIntention> {
    
    val BLOCK_NAME = RequiredContextParamType<Component, MyIntention>(
        Key.key(MyAddon, "block_name")
    )
    
    init {
        HasRequiredBlock.applyDefaults(this) // (1)!
        require(BLOCK_NAME)
        
        addAutofiller(
            BLOCK_NAME, 
            Autofiller.from(
                BLOCK_TYPE_NOVA // (2)!
            ) { type: NovaBlock -> type.name }
        )
        addAutofiller(
            BLOCK_NAME,
            Autofiller.from(
                BLOCK_TYPE_VANILLA
            ) { type: BlockType -> Component.translatable(type.translationKey()) }
        )
    }
    
}
```

1. This applies the default required parameters and autofillers that come from the `HasRequiredBlock` interface.
2. The property `BLOCK_TYPE_NOVA` is inherited from the `HasRequiredBlock` interface.