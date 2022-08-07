# addon.yml
Now that you've created your project, let's start by creating your addon.yml file. The addon.yml is used to provide 
information about your addon to Nova. It is required for all addons. **Options marked with a * are required.**

## id*

This is the id of your addon. It is used for multiple things like the addon's config folder name or the namespace for
items and blocks. This id has to start with a letter and can only contain lowercase letters, numbers and underscores.
There are also a few reserved words that can't be used as id. These are:

* ``nova``
* ``minecraft``
* ``itemsadder``
* ``oraxen``
* ``mmoitems``

Example:

```yaml
id: example
```

## name*

This is the name of your addon. It is displayed when running ``/nova addons``.

Example:

```yaml
name: Example Addon
```

## version*

The version of your addon. If you're using the template's pom.xml, you can set this to ``${project.version}`` to
automatically
get the version from the pom.xml.

Example:

```yaml
version: "1.0.0"
```

Or to automatically get the version from the pom.xml:

```yaml
version: "${project.version}"
```

## main*

Full path to your main class (without the .class extension).

Example:

```yaml
main: com.example.ExampleAddon
```

## novaVersion*

The minimum version of Nova that your addon requires.

Example:

```yaml
novaVersion: "0.10"
```

## author/authors

A list of author(s) of your addon.

Example:

```yaml
author: Example Author
```

Or for multiple authors:

```yaml
authors: [ "Example Author", "Another Author" ]
```

## spigotResourceId

The id of your addon's Spigot resource. This is used to automatically check for updates. You can find this id after the
period in the url of your addon's Spigot page.

Example (With Nova's id):

![Nova url example](https://i.imgur.com/grLp3UZ.png)

```yaml
spigotResourceId: 93648
```

## depend/softdepend

You can use these options to specify which addons your addon depends on and thus needs to be loaded before your addon
is.
The difference between ``depend`` and ``softdepend`` is that ``softdepend`` will not cause the addon to fail if the
dependency is not
loaded.

Example:

```yaml
depend:
  - machines
softdepend:
  - logistics
```

!!! info

    Unlike in spigot plugins, `depdend` and `softdepend` actually change which classes can be accessed from your addon.
    Without a (soft)dependency configured, you will not be able to access the classes of different addons at runtime.

## repositories/libraries

These options allow you to download libraries from maven repositories, so you don't have to include them in your jar.
These
libraries will be automatically downloaded and loaded. maven central is added by default.

The format for the libraries are: ``<groupId>:<artifactId>:<version>`` or if you need more
options, ``<groupId>:<artifactId>[:<extension>[:<classifier>]]:<version>``

Example:

```yaml
repositories:
  - https://repo.xenondevs.xyz/releases
libraries:
  - xyz.xenondevs.bytebase:ByteBase:0.2-SNAPSHOT
```

## Example addon.yml

```yaml
id: example_id
name: Example Addon
version: "${project.version}"
main: com.example.ExampleAddon
novaVersion: "0.10"
authors: [ "Example Author", "Another Author" ]
spigotResourceId: 93648
depend:
  - machines
softdepend:
  - logistics
repositories:
  - https://repo.xenondevs.xyz/releases
libraries:
  - xyz.xenondevs.bytebase:ByteBase:0.2-SNAPSHOT
```