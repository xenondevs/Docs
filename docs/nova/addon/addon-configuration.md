# Configure Addon

Now that you've created your project, you need to set several values in the `addon` extension.
If you're using the addon template, most of these values are already set for you.

**Options marked with a * are required.**

## name*

This is the name of your addon.
Names may only contain alphanumeric characters, periods, underscores, and hyphens (`[A-Za-z0-9._-]+`).  
The lowercase version of this name is used as your addon's id.
Your items and blocks are linked to this id, so you cannot change it later, without breaking existing worlds.

Example:

```kotlin title="build.gradle.kts addon { }"
name = "example"
```

In most cases, you can just use your project name:

```kotlin title="build.gradle.kts addon { }"
name = project.name
```

## version*

The version of the addon.

Example:

```kotlin title="build.gradle.kts addon { }"
version = "1.0"
```

Or to automatically get the version from your project:

```kotlin title="build.gradle.kts addon { }"
version = project.version.toString()
```

## main*

Full path to your addon main class (without the .class extension).

Example:

```kotlin title="build.gradle.kts addon { }"
main = "com.example.ExampleAddon"
```

## dependency

You can declare dependencies on other plugins / addons using `dependency`:

Example:

The following creates a dependency in both `BOOTSTRAP` and `SERVER` phase on the given plugin:  
(If you're depending on a Nova addon, do this)
```kotlin title="build.gradle.kts addon { }"
dependency("machines")
```

For plugins that don't have a bootstrapper, you can instead specify the phase:
```kotlin title="build.gradle.kts addon { }"
dependency("some-plugin", PluginDependency.Stage.SERVER)
```

## pluginMain

Full path to your plugin main class (without the .class extension).  
If you don't define this property, Nova will generate a plugin main class for you.
You will be able to access your plugin instance via your addon object.

Example:

```kotlin title="build.gradle.kts addon { }"
pluginMain = "com.example.ExamplePlugin"
```

## loader

A custom [plugin loader](https://docs.papermc.io/paper/dev/getting-started/paper-plugins#loaders).
Defining a custom plugin loader will disable Nova's library loading mechanism that can be
accessed via the `libraryLoader` dependency configuration.

Example:

```kotlin title="build.gradle.kts addon { }"
loader = "com.example.ExampleLoader"
```

## bootstrapper

A custom [bootstrapper](https://docs.papermc.io/paper/dev/getting-started/paper-plugins#bootstrapper).

Example:

```kotlin title="build.gradle.kts addon { }"
bootstrapper = "com.example.ExampleBootstrapper"
```

## description

A description of your addon.

Example:

```kotlin title="build.gradle.kts addon { }"
description = "This is an example addon."
```

## authors

A list of author(s) of your addon.

Example:

```kotlin title="build.gradle.kts addon { }"
authors.add("ExampleAuthor")
```

## contributors

A list of contributors to your addon.

Example:

```kotlin title="build.gradle.kts addon { }"
contributors.add("ExampleContributor")
```

Or for multiple authors:

```kotlin title="build.gradle.kts addon { }"
authors = listOf("ExampleAuthor", "Another Author")
```

## website

A website for your addon.

Example:

```kotlin title="build.gradle.kts addon { }"
website = "https://example.com"
```

## prefix

The prefix used in log messages.

Example:

```kotlin title="build.gradle.kts addon { }" 
prefix = "example"
```

## Example configuration

```kotlin title="build.gradle.kts"
addon {
    name = "ExampleAddon"
    version = "0.1"
    main = "com.example.ExampleAddon"
    authors = listOf("Example Author", "Another Author")
    dependency("machines")
}
```