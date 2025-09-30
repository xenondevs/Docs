# Custom resource pack build logic

Each resource pack to be generated has its own `ResourcePackBuildConfiguration`, which consists of tasks to be executed in a specific order. Addons can add custom tasks to existing resource pack configurations, or create their own ones to generate separate resource packs.

!!! info "The build process takes place entirely in an [in-memory file system](https://github.com/google/jimfs)."

## PackBuildData

`PackBuildData` contains data that can be shared between different `PackTasks`.

??? example

    ```kotlin
    class ExampleBuildData : PackBuildData {
        val filesToWrite = HashMap<String, String>()
    }
    ```

!!! example "Notable built-in `PackBuildData`"

    Prefer using these instead of direct file access to avoid duplicating work.

    === "ModelContent"
    
        Provides you with access to block and item models. Everything related to the creation of custom models should run through this.
        
        Using `ModelContent#rememberUsage`, you can mark a model as used, so it (and all its parents) will be included in the resource pack. This is performed automatically for all models that are assigned to `NovaItems` or `NovaBlocks`.
    
    === "LanguageContent"
    
        Provides you with access to language files.
        
        ```kotlin
        override suspend fun run() {
            val languageContent = builder.getBuildData<LanguageContent>()
            languageContent.setTranslation("en_us", "translation.key", "Hello World")
        }
        ```
    
    === "FontContent"
    
        Provides you with access to fonts.
        
        `vanillaFonts`
        
        This map shows the fonts that are part of the base game assets. These fonts are not included in Nova's resource pack.
        
        `customFonts`
        
        This map stores custom fonts and custom overrides to existing fonts from base packs, Nova, and addons. You can get and create custom fonts using `#!kotlin fontContent.get`, `#!kotlin fontContent.getOrCreate`, `#!kotlin fontContent.add`, etc.
        
        `mergedFonts`
        
        This map shows both `vanillaFonts` and `customFonts` merged together in the same way they'd be merged for the client. This might be useful if you want to add custom characters to the `minecraft:default` font without overriding existing characters. Using `#!kotlin Font.findFirstUnoccupied` or `#!kotlin Font.findFirstUnoccupiedRange` you could then search for an unoccupied range of code points.
    
    === "MovedFontContent"
    
        Allows you to request [vertically moved fonts](../fonts/fonts.md#vertical-movement).
        
        ```kotlin
        override suspend fun run() {
            val movedFontContent = builder.getBuildData<MovedFontContent>()
            movedFontContent.requestMovedFonts(ResourcePath("namespace", "name"), 0..19)
        }
        ```
    
    === "TextureIconContent"
    
        Allows you to request textures for Nova's texture-icon font.
        
        ```kotlin
        override suspend fun run() {
            val textureIconContent = builder.getBuildData<TextureIconContent>()
            textureIconContent.addIcons("minecraft:item/diamond", "minecraft:item/emerald")
        }
        ```
        
        They can then be retrieved later:
        
        ```kotlin
        val component: Component = TextureIconContent.getIcon(Key.key("minecraft:item/diamond")).component
        ```

## PackTask

`PackTasks` contain the actual logic to be run during the build process. They can use the data from registered `PackBuildData` instances by retrieving them using `ResourcePackBuilder#getBuildData`. Dependencies between tasks can be specified by overriding the `runsAfter` and `runsBefore` properties. If necessary, tasks can also explicitly specify the build stage (either post- or pre-world) by overriding the `buildStage` property.

If the `NovaDev` system property is set (`-DNovaDev`), Nova will dump the task dependency graph to `debug/nova/resource_pack_<id>.dot`.

??? abstract "Build Stages"

    There are two build stages: `PRE_WORLD` and `POST_WORLD`. This is because some logic needs to be done before the world has been loaded (such as assigning block states to nova block types) but some other logic might need to interact with things that are only possible after the world has been loaded. By default, the stage is `#!kotlin BuildStage.AUTOMATIC`, which means that the build stage will be determined based on the given `runsAfter` and `runsBefore` dependencies. If there are no dependencies, the stage will be `PRE_WORLD`.


??? example

    The following tasks use the previously created `ExampleBuildData` to share data between them. `ExampleChangeValueTask` writes to the `filesToWriteMap`, then `ExampleWriteTask` writes everything to disk.

    ```kotlin
    class ExampleChangeValueTask(
        private val builder: ResourcePackBuilder
    ) : PackTask {
        
        override val runsBefore = setOf(ExampleWriteTask::class) // (1)!
        
        override suspend fun run() {
            val buildData = builder.getBuildData<ExampleBuildData>()
            buildData.filesToWrite["out.txt"] = "Hello World!"
        }
    
    }
    ```
    
    1. This task runs before `ExampleWriteTask`. Without this dependency, the execution order would be undefined and `ExampleWriteTask` may be run before anything was added to the `filesToWrite` map.
    
    ```kotlin
    class ExampleWriteTask(
        private val builder: ResourcePackBuilder
    ) : PackTask {
        
        override suspend fun run() {
            for ((pathString, content) in builder.getBuildData<ExampleBuildData>().filesToWrite) {
                val path = builder.resolve(pathString)
                path.createParentDirectories()
                path.writeText(content)
            }
        }
    
    }
    ```
    
    You can also make `PackTasks` inner classes of your own BuildData like this:
    
    ```kotlin
    class ExampleBuildData(
        private val builder: ResourcePackBuilder
    ) : PackBuildData {
    
        val filesToWrite = HashMap<String, String>()
        
        inner class ChangeValue : PackTask {
            
            override val runsBefore = setOf(Write::class)
            
            override suspend fun run() {
                filesToWrite["out.txt"] = "Hello World!"
            }
            
        }
        
        inner class Write : PackTask {
            
            override suspend fun run() {
                for ((pathString, content) in filesToWrite) {
                    val path = builder.resolve(pathString)
                    path.createParentDirectories()
                    path.writeText(content)
                }
            }
            
        }
    
    }
    ```

## PackZipper

Generates the resource pack `.zip` file from the in-memory file system of the resource builder. You can switch to a custom `PackZipper` implementation if needed via `#!kotlin ResourcePackConfiguration#setZipper`.

## PackPostProcessor

Tasks that are run after the resource pack has been zipped. May be useful to do post-processing on the generated resource pack using external tools. By default, Nova has no post-processors. You can add post-processors to a pack configuration using `#!kotlin ResourcePackConfiguration#registerPostProcessor`.

## Resource filters

Resource filters are used to filter out resources that should not be included in the resource pack. The resource filters configured in Nova's `config.yml` only affect the `nova:core` resource pack configuration. Addons can register resource filters to existing or additional resource pack configurations via `#!kotlin ResourcePackConfiguration#registerResourceFilters`.

During the build process, you can retrieve the filters using `#!kotlin ResourcePackBuilder#getResourceFilters(stage)`. Depending on what your task is doing, it may be necessary for you to manually check them for exclusions.

## Modifying existing pack configurations

This adds additional tasks to the existing `nova:core` resource pack configuration:

```kotlin
ResourcePackBuilder.configure(ResourcePackBuilder.CORE_PACK_ID) {
    registerBuildData(::ExampleBuildData)
    registerTask(::ExampleChangeValueTask)
    registerTask(::ExampleWriteTask)
}
```

## Creating a new pack configuration

This registers a new resource pack configuration with the key `example:my_resource_pack` that runs only the tasks registered there:

```kotlin
ResourcePackBuilder.register(Key.key("example", "my_resource_pack")) {
    registerBuildData(::ExampleBuildData)
    registerTask(::ExampleChangeValueTask)
    registerTask(::ExampleWriteTask)
    
    registerTask(::PackMcMetaTask)
}
```

## Selectively apply packs to players

By default, the resource pack will be sent to all players. You can disable this by setting `#!kotlin isEnabledByDefault = false` in the pack configuration. Then, you can selectively apply the resource pack to players using `#!kotlin ResourcePackManager.enablePack(player, id)`,  `#!kotlin ResourcePackManager.disablePack(player, id)`, `#!kotlin ResourcePackManager.resetPack(player, id)`. You can also leave the pack as enabled by default, then disable it for select players.