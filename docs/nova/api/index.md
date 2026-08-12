---
icon: lucide/code-xml
---

# Getting Started

!!! tip "Looking to add custom items and blocks?"

    The Plugin API is only intended for integrating existing plugins with Nova.  
    To add custom content, create an addon via the [Addon API](../addon/) instead.

To use the Nova API you first have to add the xenondevs maven repository to your build configuration.

=== "Maven"

    ```xml
    <repository>
        <id>xenondevs</id>
        <url>https://repo.xenondevs.xyz/releases</url>
    </repository>
    ```

=== "Gradle Groovy"

    ```groovy
    maven {
        url 'https://repo.xenondevs.xyz/releases'
    }
    ```

=== "Gradle Kotlin"

    ```kotlin
    maven("https://repo.xenondevs.xyz/releases")
    ```

Now you can add the API dependency to your build configuration:

=== "Maven"

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.nova</groupId>
        <artifactId>nova-api</artifactId>
        <version>VERSION</version>
        <scope>provided</scope>
    </dependency>
    ```

=== "Gradle Groovy"

    ```groovy
    implementation "xyz.xenondevs.nova:nova-api:VERSION"
    ```

=== "Gradle Kotlin"

    ```kotlin
    implementation("xyz.xenondevs.nova:nova-api:VERSION")
    ```

To get the Nova instance you can use the `Nova` class:

=== "Kotlin"

    ```kotlin
    val nova = Nova.getNova()
    ```

=== "Java"

    ```java
    Nova nova = Nova.getNova();
    ```

You can use this instance to access everything else:

- [Adding custom protection checks](./protection/protectionintegration.md)
- [Getting `NovaItems`](./items/index.md)
- [Working with `NovaBlocks` and `NovaBlockStates`](./blocks/index.md)
- [Working with `TileEntities`](./tileentity/index.md)
- [Toggling the WAILA overlay](./player/wailamanager.md)
