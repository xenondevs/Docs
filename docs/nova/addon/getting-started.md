**This guide is not beginner-friendly! Making Nova addons requires a lot of
knowledge about Kotlin, the Spigot API, Maven and Gradle.**

## Prerequisites

### BuildTools

While you don't necessarily need to access NMS while making an addon, installing a mojang-mapped spigot version is still
required. If you're not familiar with BuildTools you can read [this guide](https://www.spigotmc.org/wiki/buildtools/). After
downloading BuildTools, run the following command:

```bash
java -jar BuildTools.jar --remapped
```

This will install the latest mojang-mapped spigot version on your local maven repository.

### IntelliJ

Even though Eclipse does have Kotlin support via a plugin, it's not the best option. We recommend using [IntelliJ](https://www.jetbrains.com/idea/)
to make addons.

### GitHub

This guide uses a GitHub repo template so having a GitHub account is recommended. You can also install [GitHub Desktop](https://desktop.github.com/)
if you don't want to use git commands.

### Codestyle

You can find the xenondevs' codestyle [here](https://github.com/xenondevs/Nova/blob/main/codestyle.xml). To apply it, open 
your Intellij settings and import the codestyle.xml file here:

![importing](https://i.imgur.com/gvLfaQg.png)

## Setting up your project

You can now create a new repo using our addon template [here](https://github.com/xenondevs/Nova-Addon-Template/generate).
After creating the new repo and cloning it, make sure to edit the following files:

### src/main/kotlin

Change the package name to your own.

### settings.gradle.kts

Change `rootProject.name` to your addon id.

### build.gradle.kts

Change `group` to your group.  
Change `version` to your version.

In the `addon` task, set `main` to your addon main class.

## Adding dependencies

If your addon requires dependencies that need to be present at runtime, add them under the `nova` configuration:

```kotlin title="build.gradle.kts dependencies { }"
nova("commons-net:commons-net:3.8.0")
```

## Building

To build, run
```bash title="Build with Gradle"
gradle addonJar "-DoutDir=<Path to your addons directory here>"
```
Or if you're on a mojang-mapped server, run
```bash title="Build with Gradle"
gradle addonJar "-DoutDir=<Path to your addons directory here>" -Dmojang-mapped
```

!!! warning

    Some things like particles won't work on mojang-mapped servers

## Enabling dev mode

Nova's reload prevention can get pretty annoying while making addons. To bypass this check, you can enable dev mode by 
adding ``-DNovaDev`` in front of ``-jar`` in your server start script. This also allows you to bypass other restrictions,
like joining the server during startup.