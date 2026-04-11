Similar to [ItemBehaviors](../items/item-behaviors.md), you can implement block logic via `BlockBehavior`. You can find a list of all available default behaviors [here](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.block.behavior/index.html).
```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks {

   val EXAMPLE_BLOCK = ExampleAddon.block("example_block") {
       behaviors(/*...*/)
   }

}
```

### Block use (right-click)

When a player right-clicks a block of your custom block type, `#!kotlin BlockBehavior.useItemOn` (if the player has an item in their hand) and `#!kotlin BlockBehavior.use` are called. Right-clicking while sneaking is interpreted as the "secondary action" and skips block behaviors.

??? abstract "interaction loop: right-click block"

    Note: If multiple item- or block behaviors are defined, the handler functions will be called in the order the behaviors were defined. The loop is immediately exited once a handler returns a `Success` or `Fail` result.

    ```mermaid
    flowchart
        A["player right-clicks\nNovaBlock with NovaItem"] --> B{"is sneaking?"}
    
        B -- "yes" --> IB_UOB
        B -- "no" --> BB_UIO
    
        BB_UIO["BlockBehavior.useItemOn"]
        BB_UIO -- "success" --> S1("✔")
        BB_UIO -- "fail" --> F1("✘")
        BB_UIO -- "pass" --> BB_U
    
        BB_U["BlockBehavior.use"]
        BB_U -- "success" --> S2("✔")
        BB_U -- "fail" --> F2("✘")
        BB_U -- "pass" --> IB_UOB
    
        IB_UOB["ItemBehavior.useOnBlock"]
        IB_UOB -- "success" --> S3("✔")
        IB_UOB -- "fail" --> F3("✘")
        IB_UOB -- "pass" --> IB_U
        
        IB_U["ItemBehavior.use"]
        IB_U -- "success" --> S4("✔")
        IB_U -- "fail" --> F4("✘")
        IB_U -- "pass" --> R
        
        R{"main hand?"}
        R -- "yes: retry with off-hand" --> B
        R -- "no: fail" --> F5("✘")
    ```

### Random ticks

To receive random ticks in your block behavior, make sure to also override `#!kotlin BlockBehavior.ticksRandomly` function which is used to define what block states can receive random ticks.

Every tick, every chunk section (16x16x16 blocks) will have `random-tick-speed` blocks chosen randomly to receive a random tick via `#!kotlin BlockBehavior.handleRandomTick`.
