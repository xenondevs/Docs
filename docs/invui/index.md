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

Now you can add InvUI as a dependency:

=== "Maven"

    ```xml
    <dependency>
        <groupId>de.studiocode.invui</groupId>
        <artifactId>InvUI</artifactId>
        <version>VERSION</version>
    </dependency>
    ```

=== "Gradle Groovy"

    ```groovy
    implementation "de.studiocode.invui:InvUI:VERSION"
    ```

=== "Gradle Kotlin"

    ```kotlin
    implementation("de.studiocode.invui:InvUI:VERSION")
    ```
