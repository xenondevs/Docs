# InvUI

## Configuring Maven / Gradle

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
    maven {
        url = uri("https://repo.xenondevs.xyz/releases")
    }
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
