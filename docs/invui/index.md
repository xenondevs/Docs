# InvUI

Minimum required Java version: `25`

!!! warning "Dropped multi-version and Spigot support in v2"

    Starting with v2, InvUI no longer supports multiple Minecraft versions. Instead, InvUI only targets the latest Minecraft version. Additionally, InvUI no longer supports Spigot, but only Paper and its forks.

## Configuring Maven / Gradle

To use InvUI, you first have to add the xenondevs maven repository to your build configuration.

=== "Gradle Kotlin"

    ```kotlin
    maven("https://repo.xenondevs.xyz/releases")
    ```

=== "Gradle Groovy"

    ```groovy
    maven {
        url 'https://repo.xenondevs.xyz/releases'
    }
    ```

=== "Maven"

    ```xml
    <repository>
        <id>xenondevs</id>
        <url>https://repo.xenondevs.xyz/releases</url>
    </repository>
    ```

Now you can add InvUI as a dependency:

=== "Gradle Kotlin"

    ```kotlin
    implementation("xyz.xenondevs.invui:invui:VERSION")
    ```

=== "Gradle Groovy"

    ```groovy
    implementation "xyz.xenondevs.invui:invui:VERSION"
    ```

=== "Maven"

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.invui</groupId>
        <artifactId>invui</artifactId>
        <version>VERSION</version>
    </dependency>
    ```

If you're using Kotlin, consider adding the `invui-kotlin` module:

=== "Gradle Kotlin"

    ```kotlin
    implementation("xyz.xenondevs.invui:invui-kotlin:VERSION")
    ```

=== "Gradle Groovy"

    ```groovy
    implementation "xyz.xenondevs.invui:invui-kotlin:VERSION"
    ```

=== "Maven"

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.invui</groupId>
        <artifactId>invui-kotlin</artifactId>
        <version>VERSION</version>
    </dependency>
    ```

To find the latest InvUI version, check out the [GitHub Releases Page](https://github.com/NichtStudioCode/InvUI/releases) or explore the [Maven Repository](https://repo.xenondevs.xyz/#/releases/xyz/xenondevs/invui/invui/).

## Javadoc

Not all functionality of InvUI is covered here. For a detailed overview of all classes and methods, take a look at the [InvUI javadoc](https://repo.xenondevs.xyz/javadoc/releases/xyz/xenondevs/invui/invui/latest) and the [InvUI-Kotlin KDoc](https://repo.xenondevs.xyz/javadoc/releases/xyz/xenondevs/invui/invui-kotlin/latest).

## Thread Safety & Folia Support

Like most of the Bukkit API, InvUI is also **not** thread-safe and should only be used from the server thread.

InvUI currently **experimentally** supports Folia. If you're running Folia, the correct thread to use InvUI from is the thread that owns the viewing entity (i.e. use the viewer's `EntityScheduler`). Also note that, because of this, you cannot share **anything** (including, but not limited to: `Gui`, `Item`, `ItemProvider`, `VirtualInventory`) between players as they might not be in the same region.