# Tile Entity Networks - Introduction

## Overview

The following diagram is intended to give a quick overview on how Nova's network system works.  
For more detailed information, check out the KDocs.

```mermaid
classDiagram
  class NetworkCluster {
      A collection of networks that share at least one NetworkNode.
  }
  class NetworkGroup {
      A subset of a network cluster, grouped by network type.
  }
  class Network {
      A collection of network nodes that are connected to each other.
  }
  class NetworkNode
  class NetworkEndPoint
  class NetworkBridge {
      Cables / Pipes / etc.
  }
  class EndPointDataHolder {
      Holds data for a specific network type.
  }
  
  NetworkCluster o-- NetworkGroup : contains
  NetworkGroup o-- Network : contains
  Network o-- NetworkNode : contains
  NetworkNode <|-- NetworkEndPoint : is
  NetworkNode <|-- NetworkBridge : is
  NetworkEndPoint *-- EndPointDataHolder : contains

```

In most cases, you won't need to worry about the network system and will just inherit
from [NetworkedTileEntity](networked-tile-entity.md) to make your tile-entity network compatible.

??? tip "Visualization: Networks vs. Network Clusters"

    **(Item-)Networks** `/nova debug showNetwork nova:item`:

    ![](https://imgur.com/LqBLa73.png)

    **Network Clusters** `/nova debug showNetworkClusters`:

    ![](https://imgur.com/9YbSwKr.png)

## Network Tick

Most of the tick logic of networks is run in parallel with networks from other clusters:

```mermaid
graph TD
    A[Server Tick] --> B[Sync Network Tick\nNetwork preparation logic that accesses world state and thus cannot be run in parallel]
    B --> C1[Cluster 1 Tick]
    B --> C2[Cluster 2 Tick]
    B --> CN[Cluster ... Tick]
    C1 --> D[Sync Network Tick\nNetwork post-tick logic that accesses world state and thus cannot be run in parallel]
    C2 --> D
    CN --> D
    D --> E[Server Tick]
subgraph Parallel
    direction LR
    C1
    C2
    CN
end
```

Because network tick logic is run in parallel, it is imperative that networks do not modify the world state
(apart from the data stored in the NetworkNodes themselves), which also requires update handlers (for example for
inventories or fluid containers) to behave in the same way.

## Default network types

By default, Nova ships with 3 network types: `nova:energy`, `nova:item` and `nova:fluid`.

| Id            | EndPointDataHolder type | Description                            |
|---------------|-------------------------|----------------------------------------|
| `nova:energy` | `EnergyHolder`          | Distributes energy between end points. |
| `nova:item`   | `ItemHolder`            | Distributes items between end points.  |
| `nova:fluid`  | `FluidHolder`           | Distributes fluids between end points. |

## (Un-)registering NetworkNodes

To register/unregister `NetworkNodes`, queue a network task using `NetworkManager`:

```kotlin
NetworkManager.queueAddEndPoint(endPoint) // registers an end point
NetworkManager.queueAddBridge(bridge, supportedNetworkTypes) // registers a bridge

NetworkManager.queueRemoveEndPoint(endPoint) // unregisters an end point
NetworkManager.queueRemoveBridge(bridge) // unregisters a bridge
```

You'll need to add `NetworkNodes` after they've been placed and also remove them when they're destroyed.
You don't need to add/remove on chunk (un-)load.

If you're using [NetworkedTileEntity](networked-tile-entity.md), this will be done for you.

## Interacting with NetworkState (advanced)

To interact with any network-related data (for example `connectionConfig` of `ItemHolder`),
you need to queue a network task using `NetworkManager` to prevent concurrency issues.  
Here, you'll also obtain an instance of `NetworkState`, which gives you access to all network-related data
of the given chunk's world.
For more information, check out the KDocs.

```kotlin
NetworkManager.queueRead(chunkPos) { state: NetworkState ->
    // code that only reads from state
}

NetworkManager.queueWrite(chunkPos) { state: NetworkState ->
    // code that writes to state
}

NetworkManager.queue(chunkPos) { state: NetworkState ->
    var hasWritten = false
    // code that may write to state
    return@queue hasWritten
}
```

After a network task that writes to the state was executed, dirty networks will be rebuilt.