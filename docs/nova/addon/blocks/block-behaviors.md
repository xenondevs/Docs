Similar to [ItemBehaviors](../items/item-behaviors.md), you can implement block logic via `BlockBehavior`.

```kotlin
@Init(stage = InitStage.PRE_PACK)
object Blocks : BlockRegistry by ExampleAddon.registry {

   val EXAMPLE_BLOCK = block("example_block") {
       behaviors(/*...*/)
   }

}
```

## Default block behaviors

For a list of all available default block behaviors, refer to the
[KDocs](https://nova.dokka.xenondevs.xyz/nova/xyz.xenondevs.nova.world.block.behavior/index.html)

## Custom Block Behavior

To create a custom block behavior, you just need to implement the `BlockBehavior` interface and override the desired
event methods.

### Random ticks

To receive random ticks in your block behavior, make sure to also override `#!kotlin BlockBehavior.ticksRandomly`
which is used to define what block states can receive random ticks.

Every tick, every chunk section (16x16x16 blocks) will have `random-tick-speed` blocks chosen randomly to receive a
random tick.
