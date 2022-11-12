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
    maven {
        url = uri("https://repo.xenondevs.xyz/releases")
    }
    ```

Now you can add the API dependency to your build configuration:

=== "Maven"

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.nova</groupId>
        <artifactId>nova-api</artifactId>
        <version>0.11</version>
        <scope>provided</scope>
    </dependency>
    ```

=== "Gradle Groovy"

    ```groovy
    implementation "xyz.xenondevs.nova:nova-api:0.11"
    ```

=== "Gradle Kotlin"

    ```kotlin
    implementation("xyz.xenondevs.nova:nova-api:0.11")
    ```

To get the Nova instance you can use the `Nova` class:

=== "Kotlin"

    ```kotlin
    val nova = Nova // (1)!
    ```

    1. `Nova` is an interface but the companion object delegates to ``Bukkit.getPluginManager().getPlugin("Nova") as Nova``.

=== "Java"

    ```java
    Nova nova = Nova.getNova();
    ```

You can use this instance to access everything else:

- [Adding custom protection checks](./protection/protectionintegration.md)
- [Getting ``NovaMaterials``](./material/index.md)
- [Working with TileEntities](./tileentity/tileentitymanager.md)
- [Managing Nova Blocks](./blocks/blockmanager.md)
- [Toggling the WAILA overlay](./player/wailamanager.md)