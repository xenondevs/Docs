# InvUI

Minimum required Java version: `21`

!!! warning "Dropped multi-version and Spigot support in v2"

    Starting with v2, InvUI no longer supports multiple Minecraft versions. Instead, InvUI only targets the latest Minecraft version. Additionally, InvUI no longer supports Spigot, but only Paper and its forks.

!!! warning "Documentation is work in progress"

    This documentation is still WIP. All code examples are currently Kotlin, the Java translations will be added in the future.

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

Not all functionality of InvUI is covered here. For a detailed overview of all classes and methods, take a look at the [InvUI javadoc](https://repo.xenondevs.xyz/javadoc/releases/xyz/xenondevs/invui/invui/2.0.0-alpha.16).