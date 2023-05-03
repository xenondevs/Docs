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

Now you can add InvUI as a dependency:

=== "Maven"

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.invui</groupId>
        <artifactId>invui</artifactId>
        <version>VERSION</version>
        <type>pom</type>
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

??? tip "(optional) Manually choosing inventory-access revisions"

    InvUI uses `inventory-access` for multi-version support. If you depend on the `invui` module, you'll automatically
    get all available `inventory-access` revisions.  
    If your plugin does not have multi-version support or you only need versions, you can either exclude the
    related `inventory-access` revisions or instead depend on the `invui-core` module which does not have any transitive
    dependencies on any `inventory-access` revisions.

    ```xml
    <dependency>
        <groupId>xyz.xenondevs.invui</groupId>
        <artifactId>invui-core</artifactId>
        <version>VERSION</version>
    </dependency>
    <dependency>
        <groupId>xyz.xenondevs.invui</groupId>
        <artifactId>inventory-access-r13</artifactId> <!--(1)!-->
        <classifier>remapped-mojang</classifier> <!--(2)!-->
        <version>VERSION</version>
    </dependency>
    ```

    1. You can find a list of inventory-access revisions and which Minecraft version they map to [here](https://github.com/NichtStudioCode/InvUI/blob/main/inventoryaccess/inventory-access/src/main/java/xyz/xenondevs/inventoryaccess/version/InventoryAccessRevision.java).
    2. You can also add the `remapped-mojang` classifier to get InvUI working on mojang-mapped servers.

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