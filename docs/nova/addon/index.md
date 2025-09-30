**This guide is not beginner-friendly! Creating Nova addons requires advanced knowledge of Kotlin, the Paper API, and Gradle.**

## Setting up your project

You can create a new repo using our addon template [here](https://github.com/xenondevs/Nova-Addon-Template/generate).
After creating the repo and cloning it, make sure to edit the following files:

### src/main/kotlin

Change the package name to your own.

### settings.gradle.kts

Change `rootProject.name` to your addon id.

### build.gradle.kts

Change `group` to your group.  
Change `version` to your version.

In the `addon` extension, set `main` to your addon main class.

## Adding dependencies

If your addon requires dependencies that need to be present at runtime, add them under the `libraryLoader` configuration:

```kotlin title="build.gradle.kts dependencies { }"
libraryLoader("commons-net:commons-net:3.8.0")
```

The requested library will be downloaded at startup. Note that using this mechanism exposes **all** urls of the
maven repositories you use in your build configuration.

## Building

To build, run
```bash title="Build with Gradle"
gradlew addonJar -PoutDir="<Path to your addons directory here>"
```

## Enabling dev mode

To enable dev mode, set the `NovaDev` system property using `-DNovaDev`.  
This allows you to bypass some restrictions like using addons that require a different version of Nova and
enables general-purpose debugging functionality.

Additionally, you can use `-DNovaForceRegenerateResourcePack` to force the resource pack to be regenerated on startup.

## KDoc

The generated KDoc for Nova can be found on [here](https://nova.dokka.xenondevs.xyz/).