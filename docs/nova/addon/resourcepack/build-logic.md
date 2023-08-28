# Custom resource pack build logic

To run code during the resource pack build process, you'll need to register a `PackTask`.  
Pack tasks are functions annotated with `#!kotlin @PackTask` and need to be located in a class that implements the
`PackTaskHolder` interface. Those holders then need to be registered
with `#!kotlin ResourcePackBuilder.registerTaskHolders`.

```kotlin

object ExampleAddon : Addon() {
    
    override fun init() {
        ResourcePackBuilder.registerTaskHolders(::CustomTaskHolder)
    }

}

class CustomTaskHolder(private val builder: ResourcePackBuilder) : PackTaskHolder {
    
    @PackTask
    fun customTask() {
        // Do something
    }

}

```

## PackTask

The `#!kotlin @PackTask` annotation has three optional parameters: `#!kotlin stage: BuildStage`,
`#!kotlin runAfter: Array<String>` and `#!kotlin runBefore: Array<String>`.

### Build Stages

There are two build stages: `PRE_WORLD` and `POST_WORLD`. This is because some logic needs to be done before the world
has been loaded (such as assigning block states to nova block types) but some other logic might need to interact with
other plugins that are only loaded after the world has been loaded (for example rendering the WAILA textures for blocks
of custom item services).  
By default, the stage is `#!kotlin BuildStage.AUTOMATIC`, which means that the build stage will be determined based
on the given `runAfter` and `runBefore` dependencies. If there are no dependencies, the stage will be `PRE_WORLD`.

### Dependencies

You can define which tasks should be run before or after your task using the `runAfter` and `runBefore` parameters.  
This is quite similar to the [Initialization dependencies](../misc/initialization.md#initialization-dependencies), with
the exception that you don't define classes but task names. Tasks are named after their simple class- and function name,
separated by a `#`. So if you have a class `CustomTaskHolder` with the function `customTask`, the task name would be
`CustomTaskHolder#customTask`. The benefit of using strings instead of class references is that you can configure
dependencies to specific tasks instead of the whole task holder class.

As an example, Nova's `EnchantmentContent#write` task requires language files to be loaded, certain font characters to
have been created and char sizes to be calculated, but it also writes to the language files, which means that it needs
to run before the `LanguageContent#write` task. This is how it's configured:

```kotlin
@PackTask(
    runAfter = ["LanguageContent#loadLangFiles", "EnchantmentContent#createBackgroundChars", "CharSizeCalculator#calculateCharSizes"],
    runBefore = ["LanguageContent#write"]
)
private fun write() {
    // ...
}
```

## ResourcePackBuilder

As shown in the example above, you'll register a task holder constructor that accepts a `ResourcePackBuilder` instance
as parameter. This builder instance organizes the build process and provides you with access to other task holders.

### Accessing files

Resource pack building might take place entirely in memory or on disk in the `plugins/Nova/resource_pack/.build/`
directory,
depending on the server configuration. In-memory resource pack generation is implemented using
[JIMFS](https://github.com/google/jimfs) and is the reason why all file access runs over `java.nio.Path` instead of
`java.io.File`.  
You can find the most important directories as properties in the companion object of `ResourcePackBuilder`, such as
`RESOURCE_PACK_BUILD_DIR` and `ASSETS_DIR`. These paths will always point to the correct file system, so you don't need
to worry about whether the resource pack is being built in memory or on disk.

### Retrieving `PackTaskHolder` instances

When creating a custom task, you might want to interact with existing task holders from your own addon, Nova, or other
addons. To retrieve a task holder instance, call `#!kotlin resourcePackBuilder.getHolder<HolderType>()` with the
holder class as type parameter.

```kotlin
class CustomTaskHolder(private val builder: ResourcePackBuilder) : PackTaskHolder {
    
    @PackTask
    fun customTask() {
        val languageContent = builder.getHolder<LanguageContent>()
        languageContent.setTranslation("en_us", "translation.key", "Hello World")
    }

}
```

### Retrieving resource filters

Resource filters are used to filter out resources that should not be included in the resource pack.
They can be configured by server admins and addon developers
using `#!kotlin ResourcePackBuilder.registerResourceFilter`.  
During the build process, you can retrieve the filters using `#!kotlin resourcePackBuilder.getResourceFilters(stage)`.
If writes additional files, you should check whether are configured to be excluded.

## Important built-in task holders

The following are the most important built-in task holders, which you might need to interact with in code.  
You should prefer using these instead of direct file access, because they would probably overwrite your changes and are
generally more convenient and performant to use.

!!! abstract "All other pack tasks"

    A list of all pack tasks and their execution order will be shown in the console every time the resource pack is built.

### LanguageContent

Provides you with access to language files.

```kotlin
@PackTask
fun task() {
    val languageContent = builder.getHolder<LanguageContent>()
    languageContent.setTranslation("en_us", "translation.key", "Hello World")
}
```

### FontContent

Provides you with access to fonts.

#### `vanillaFonts`

This map shows the fonts that are part of the base game assets. These fonts are not included in Nova's resource pack.

#### `customFonts`

This map stores custom fonts and custom overrides to existing fonts from base packs, Nova, and addons.  
You can get and create custom fonts using `#!kotlin fontContent.get`, `#!kotlin fontContent.getOrCreate`,
`#!kotlin fontContent.add`, etc.

#### `mergedFonts`

This map shows both `vanillaFonts` and `customFonts` merged together in the same way they'd be merged for the client.  
This might be useful if you want to add custom characters to the `minecraft:default` font without overriding existing
characters. Using `#!kotlin Font.findFirstUnoccupied` or `#!kotlin Font.findFirstUnoccupiedRange` you could then search
for an unoccupied range of code points.

!!! warning "Resource-intensive operation"

    Because `customFonts` might change at any time, retrieving the `mergedFonts` map will always merge the `vanillaFonts`
    and `customFonts` map again, which is a relatively resource-intesive operation.

### MovedFontContent

Allows you to request [vertically moved fonts](../fonts/fonts.md#vertical-movement).

```kotlin
@PackTask
fun task() {
    val movedFontContent = builder.getHolder<MovedFontContent>()
    movedFontContent.requestMovedFonts(ResourcePath("namespace", "name"), 0..19)
}
```

### TextureIconContent

Allows you to request textures for Nova's texture-icon font.

```kotlin
@PackTask
fun task() {
    val textureIconContent = builder.getHolder<TextureIconContent>()
    textureIconContent.addIcons("minecraft:item/diamond", "minecraft:item/emerald")
}
```

They can then be retrieved from the `TEXTURE_ICON_LOOKUP`:

```kotlin
val component: Component = ResourceLookups.TEXTURE_ICON_LOOKUP[ResourceLocation("minecraft:item/diamond")].component
```