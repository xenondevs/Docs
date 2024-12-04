## Network Type

To create a custom network type, implement `NetworkTypeRegistry` as usual:

```kotlin
@Init(stage = InitStage.PRE_WORLD)
class NetworkTypes : NetworkTypeRegistry by Logistics.registry {
    
    val EXAMPLE = registerNetworkType(
        name = "example",
        createNetwork = ::ExampleNetwork, // (1)!
        createGroup = ::ExampleNetworkGroup, // (2)!
        validateLocal = ExampleNetwork::validateLocal, // (3)!
        tickDelay = provider(1), // (4)!
        holderTypes = arrayOf(ExampleDataHolder::class, ItemHolder::class) // (5)!
    )

}
```

1. A function that creates the `Network` based on `NetworkData`.
2. A function that creates the `NetworkGroup` based on `NetworkGroupData`
3. A function that validates a local network (i.e. a network of two end points that are placed directly next to each other).
4. The delay between network ticks.
5. The holder types that `NetworkNodes` require in order to qualify for this network type.
   Can be one or multiple and do not necessarily need to be custom.

## Network Group

A `NetworkGroup` is a subset of a network cluster containing only the networks of your specific network type.
The given network list is immutable and the NetworkGroup is re-created every time a network of the group is changed.

The following implementation simply delegates the main `tick` function to all networks of the group. Depending on your
needs, you may implement more complex logic here. For example, item networks take a snapshot of all inventories on a
group level in order to implement item locking.
There are also additional functions available that you can override in `NetworkGroup`, some of which are not called in
parallel with other network clusters.

To prevent code duplication, simply delegate the data properties to the `NetworkGroupData` that you receive in the constructor:

```kotlin
class ExampleNetworkGroup(data: NetworkGroupData<ExampleNetwork>) : NetworkGroup<ExampleNetwork>, NetworkGroupData<ExampleNetwork> by data {
    
    override fun tick() {
        networks.forEach(ExampleNetwork::tick)
    }

}
```

## Network

A `Network` is a collection of `NetworkNodes` that are directly connected to each other.
The given nodes map is immutable and the network is re-created every time changes are made to its layout.

To prevent code duplication, simply delegate the data properties to the `NetworkData` that you receive in the constructor:

```kotlin
class ExampleNetwork(data: NetworkData<ExampleNetwork>) : Network<ExampleNetwork>, NetworkData<ExampleNetwork> by data {
    
    fun tick() {
        // tick logic
    }

}
```

!!! abstract "Which nodes will be part of the network?"

      Generally, only network nodes that qualify for the network type will be part of networks of that type.
      For bridges, this means that they were registered as supporting the given network type. For end points, this means
      that they have the required data holders.

## Local Network Validation

Local networks are networks that consist of exactly two end points and no bridges. They are created when two network
nodes that have the correct `EndPointDataHolders` are placed directly next to each other.

For performance reasons, it is not optimal to always create a network between two adjacent tile-entities, because even
if they have the correct end point data holders and as such qualify for your custom network type, they might not be in
a state where they will actually interact with each other. (For example, if your `EndPointDataHolder` has something
like a side configuration, it may be configured to `INSERT` on both sides.)

Using the `validateLocal` function, you can prevent such networks from being created in the first place.

```kotlin title="EnergyNetwork - validateLocal""
fun validateLocal(from: NetworkEndPoint, to: NetworkEndPoint, face: BlockFace): Boolean {
    val energyHolderFrom: EnergyHolder = from.holders.firstInstanceOfOrNull<EnergyHolder>() ?: return false
    val energyHolderTo: EnergyHolder = to.holders.firstInstanceOfOrNull<EnergyHolder>() ?: return false
    val conFrom: NetworkConnectionType? = energyHolderFrom.connectionConfig[face]
    val conTo: NetworkConnectionType? = energyHolderTo.connectionConfig[face.oppositeFace]
    
    return conFrom != conTo || conFrom == NetworkConnectionType.BUFFER
}
```


## EndPointDataHolder

A custom `EndPointDataHolder` is only required if you want to supply additional data that is not already covered
by the built-in data holders `EnergyHolder`, `ItemHolder`, `FluidHolder` to the network.

`EndPointDataHolder` only has one property: `allowedFaces`, which is a set of `BlockFaces` that specifies at which
sides of the block this `EndPointDataHolder` is present. As such, if your custom network type requires `ExampleDataHolder`,
and, for example `NORTH` is not an allowed face, then there will never be a network of your custom type at the `NORTH` face.

```kotlin
class ExampleDataHolder : EndPointDataHolder {
    
    override val allowedFaces: Set<BlockFace>
        get() = TODO("Not yet implemented")
    
}
```

For reference, all built-in `EndPointDataHolders` delegate this to their `connectionConfig`:
```kotlin title="EnergyHolder (built-in), ContainerEndPointDataHolder (built-in)"
val connectionConfig: MutableMap<BlockFace, NetworkConnectionType>

override val allowedFaces: Set<BlockFace>
    get() = connectionConfig.mapNotNullTo(enumSet()) { (face, type) ->
        if (type != NetworkConnectionType.NONE) face else null
    }
```
