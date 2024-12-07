# Configure Addon

Now that you've created your project, you need to set several values in the `addon` task.
:material-information-outline:{ title="Part of the xyz.xenondevs.nova:nova-gradle-plugin" }
If you're using the addon template, most of these values are already set for you.

**Options marked with a * are required.**

## name*

This is the name of your addon.
Names may only contain alphanumeric characters, periods, underscores, and hyphens (`[A-Za-z0-9._-]+`).  
The lowercase version of this name is used as your addon's id.
Your items and blocks are linked to this id, so you cannot change it later, without breaking existing worlds.

Example:

```kotlin title="build.gradle.kts addon { }"
name.set("example")
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

## main*

Full path to your addon main class (without the .class extension).

Example:

```kotlin title="build.gradle.kts addon { }"
main.set("com.example.ExampleAddon")
```

## dependency

You can declare dependencies on other plugins / addons using `dependency`:

Example:

```kotlin title="build.gradle.kts addon { }"
dependency("machines")
```

## pluginMain

Full path to your plugin main class (without the .class extension).  
If you don't define this property, Nova will generate a plugin main class for you.
You will be able to access your plugin instance via your addon object.

Example:

```kotlin title="build.gradle.kts addon { }"
pluginMain.set("com.example.ExamplePlugin")
```

## loader

A custom [plugin loader](https://docs.papermc.io/paper/dev/getting-started/paper-plugins#loaders).
Defining a custom plugin loader will disable Nova's library loading mechanism that can be
accessed via the `libraryLoader` dependency configuration.

Example:

```kotlin title="build.gradle.kts addon { }"
loader.set("com.example.ExampleLoader")
```

## bootstrapper

A custom [bootstrapper](https://docs.papermc.io/paper/dev/getting-started/paper-plugins#bootstrapper).

Example:

```kotlin title="build.gradle.kts addon { }"
bootstrapper.set("com.example.ExampleBootstrapper")
```

## description

A description of your addon.

Example:

```kotlin title="build.gradle.kts addon { }"
description.set("This is an example addon.")
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
authors.set(listOf("ExampleAuthor", "Another Author"))
```

## website

A website for your addon.

Example:

```kotlin title="build.gradle.kts addon { }"
website.set("https://example.com")
```

## prefix

The prefix used in log messages.

Example:

```kotlin title="build.gradle.kts addon { }" 
prefix.set("example")
```

## Example configuration

```kotlin title="build.gradle.kts"
addon {
    name.set("ExampleAddon")
    version.set("0.1")
    main.set("com.example.ExampleAddon")
    authors.set(listOf("Example Author", "Another Author"))
    dependency("machines")
}
```