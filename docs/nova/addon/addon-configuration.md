# Configure Addon

Now that you've created your project, you need to set several values in the `addon` task.
:material-information-outline:{ title="Part of the xyz.xenondevs.nova:nova-gradle-plugin" }
If you're using the addon template, most of these values are already set for you.

**Options marked with a * are required.**

## id*

This is the id of your addon. It is used for multiple things like the addon's config folder name or the namespace for
items and blocks.  
Please note that:

<div class="annotate" markdown>
* The id has to start with a letter and can only contain lowercase letters, numbers and `_`, `-`. (1)
* Addon ids should not be changed after release, as that will break items and blocks in existing worlds.   
* There are also a few reserved namespaces that cannot be used: `minecraft`, `nova`, `itemsadder`, `oraxen`, `mmoitems`.
  This list might be expanded in the future, so you should generally avoid using namespaces that are already used by other
  well-known plugins.
</div>

1. Regex: `^[a-z][a-z\d_-]*$`

Example:

```kotlin title="build.gradle.kts addon { }"
id.set("example")
```

In most cases, you can just use your project name:

```kotlin title="build.gradle.kts addon { }"
id.set(project.name)
```

## name*

This is the displayed name of your addon. Unlike the addon id, there are no naming restrictions.
The name can be changed at any time.

Example:

```kotlin title="build.gradle.kts addon { }"
name.set("Example Addon")
```

In most cases, you can just use your project name:

```kotlin title="build.gradle.kts addon { }"
name.set(project.name)
```

## version*

The version of the addon.

Example:

```kotlin title="build.gradle.kts addon { }"
version.set("1.0")
```

Or to automatically get the version from your project:

```kotlin title="build.gradle.kts addon { }"
version.set(project.version.toString())
```

## novaVersion*

The minimum version of Nova that your addon requires.

Example:

```kotlin title="build.gradle.kts addon { }"
novaVersion.set("0.11")
```

Or use the version set in your version catalog:

```kotlin title="build.gradle.kts addon { }"
novaVersion.set(deps.versions.nova)
```

## main*

Full path to your main class (without the .class extension).

Example:

```kotlin title="build.gradle.kts addon { }"
main.set("com.example.ExampleAddon")
```

## author/authors*

A list of author(s) of your addon.

Example:

```kotlin title="build.gradle.kts addon { }"
authors.add("ExampleAuthor")
```

Or for multiple authors:

```kotlin title="build.gradle.kts addon { }"
authors.set(listOf("ExampleAuthor", "Another Author"))
```

## depend/softdepend

You can use these options to specify which addons your addon depends on and thus needs to be loaded before your addon
is.
The difference between ``depend`` and ``softdepend`` is that ``softdepend`` will not cause the addon to fail if the
dependency is not
loaded.

Example:

```kotlin title="build.gradle.kts addon { }"
depend.add("machines")
softdepend.add("logistics")
```

!!! info

    Unlike in spigot plugins, `depdend` and `softdepend` actually change which classes can be accessed from your addon.
    Without a (soft)dependency configured, you will not be able to access the classes of different addons at runtime.

## Example configuration

```kotlin title="build.gradle.kts"
addon {
    id.set("example")
    name.set("Example Addon")
    version.set("0.1")
    novaVersion.set("0.11")
    main.set("com.example.ExampleAddon")
    authors.set(listOf("Example Author", "Another Author"))
    depend.add("machines")
    softdepend.add("logistics")
}
```