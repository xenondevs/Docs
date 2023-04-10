# TileEntity Particles

To continuously spawn particles for your TileEntity, you can use the ``createPacketTask`` function and save the task in
a field. The function expects a list of packets and a tick interval. To get the particle packets you can use the
`ParticleBuilder` obtained by the top-level function `particle`.  
For example, for the FurnaceGenerator we have the following setup:

```kotlin
private val particleTask = createPacketTask(listOf(
    particle(ParticleTypes.SMOKE) {
        location(centerLocation.advance(getFace(FRONT), 0.6).apply { y += 0.8 })
        offset(getFace(BlockSide.RIGHT).axis, 0.15f)
        offsetY(0.1f)
        speed(0f)
        amount(5)
    }
), 1)
```

You can then call ``particleTask.start()`` and ``particleTask.stop()`` depending on whether you want to start or stop
displaying the particles.