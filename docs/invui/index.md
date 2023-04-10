# InvUI

## Configuring Maven / Gradle

Minimum required Java version: `11`

To use InvUI, you first have to add the xenondevs maven repository to your build configuration.

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

Now you can add InvUI as to your build configuration:

=== "Maven"

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.invui</groupId>
        <artifactId>invui</artifactId>
        <version>VERSION</version>
    </dependency>
    ```

=== "Gradle Groovy"

    ```groovy
    implementation "xyz.xenondevs.invui:invui:VERSION"
    ```

=== "Gradle Kotlin"

    ```kotlin
    implementation("xyz.xenondevs.invui:invui:VERSION")
    ```

If you're using Kotlin, you should also add the `invui-kotlin` module:

=== "Maven"

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.invui</groupId>
        <artifactId>invui-kotlin</artifactId>
        <version>VERSION</version>
    </dependency>
    ```

=== "Gradle Groovy"

    ```groovy
    implementation "xyz.xenondevs.invui:invui-kotlin:VERSION"
    ```

=== "Gradle Kotlin"

    ```kotlin
    implementation("xyz.xenondevs.invui:invui-kotlin:VERSION")
    ```

To find the latest InvUI version, you can explore the [Maven Repository](https://repo.xenondevs.xyz/#/releases/xyz/xenondevs/invui/invui/)
or check out the [GitHub Releases Page](https://github.com/NichtStudioCode/InvUI/releases).