# addon.yml

```yaml
id: example # (1)
name: Example # (2)
version: ${project.version} # (3)
main: com.example.ExampleAddon # (4)
authors: [ "ExampleAuthor" ] # (5)
spigotResourceId: 12345 # (6)
```

1. This is your addon id. It is used for multiple things like the addon's config folder name or the namespace for items and blocks.
2. This is the addon name. Displayed in ``/nova addons``
3. If you use the provided pom.xml, the maven resources plugin will automatically set the version during the build.
4. Main class of your addon. Similar to a spigot plugin's main class.
5. The author(s) of your addon.
6. The spigot resource id of your addon. This is used to automatically check for updates.