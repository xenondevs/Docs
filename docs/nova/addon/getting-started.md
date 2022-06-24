**This guide is not beginner-friendly! Making Nova addons requires a lot of
knowledge about the Kotlin, the Spigot API and Maven.**

## Prerequisites

### BuildTools

While you don't necessarily need to access NMS while making an addon, we still recommend installing a mojang-mapped spigot
version. If you're not familiar with BuildTools you can read [this guide](https://www.spigotmc.org/wiki/buildtools/). After
downloading BuildTools, run the following command:

```bash
java -jar BuildTools.jar --remapped
```

This will install the latest mojang-mapped spigot version on your local maven repository.

### Intellij

Even though Eclipse does have Kotlin support via a plugin, it's not the best option. We recommend using [IntelliJ](https://www.jetbrains.com/idea/)
to make addons.

### GitHub

This guide uses a GitHub repo template so having a GitHub account is recommended. You can also install [GitHub Desktop](https://desktop.github.com/)
if you don't want to use git commands.

### InvUI

Nova uses the InvUI library for everything UI based. You can read the wiki [here](../../invui/index.md).

## Setting up your project

You can now create a new repo using our addon template [here](https://github.com/xenondevs/Nova-Addon-Template/generate).
After creating the new repo and cloning it, make sure to edit the following files:

### pom.xml

Change `<groupId>` and `<artifactId>` to your own.

### src/main/kotlin

Change the package name to your own.