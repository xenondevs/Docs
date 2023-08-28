# Initialization

Simply annotate your class with `#!kotlin @Init` and Nova will load it during the specified initialization stage.

## Initialization Stages

These are the available initialization stages:

| Stage                                    | Description                                                                                                     |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `#!kotlin InitStage.PRE_WORLD`           | Before the world is loaded.                                                                                     |
| `#!kotlin InitStage.PRE_PACK`            | Before the resource pack generation starts.                                                                     |
| `#!kotlin InitStage.POST_PACK_PRE_WORLD` | After the first stage of resource pack generation ("pre-world") has finished. Lookup registries are now loaded. |
| `#!kotlin InitStage.POST_WORLD`          | After the world has been loaded.                                                                                |
| `#!kotlin InitStage.POST_WORLD_ASYNC`    | After the world has been loaded, in an async thread.                                                            |
| `#!kotlin InitStage.POST_PACK`           | After the second (and last) stage of resource pack generation ("post-world") has finished.                      |
| `#!kotlin InitStage.POST_PACK_ASYNC`     | After the second (and last) stage of resource pack generation ("post-world") has finished, in an async thread.  |

```kotlin title="Example initializable class"
@Init(stage = InitStage.PRE_PACK)
class ExampleClass
```

## Initialization Dependencies

If the pre-defined initialization stages are not enough for you, you can also configure which classes that should be
initialized before (`runAfter`) or after (`runBefore`) your class:

```kotlin title="Example initializable class with dependencies"
@Init(
    stage = InitStage.PRE_PACK,
    runAfter = [ClassA::class], // This class will be initialized after ClassA
    runBefore = [ClassB::class] // This class will be initialized before ClassB
)
class ExampleClass
```

## Functions

If your class is annotated with `#!kotlin @Init`, you can also annotate your functions with `#!kotlin @InitFun`
and `#!kotlin @DisableFun`:

* `#!kotlin @InitFun`: Specify one or more functions that should be called during initialization.
* `#!kotlin @DisableFun` Specify one or more functions that should be called when your addon is disabled. These
  functions are called in reverse dependency order.

```kotlin title="Example initializable class with functions"
@Init(stage = InitStage.PRE_PACK)
class ExampleClass {
    
    @InitFun
    private fun init() {
        //Run during PRE_PACK init stage
    }
  
    @DisableFun
    private fun disable() {
        // Run when the addon is disabled
    }
    
}
```