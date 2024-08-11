!!! tip "Minecraft Resource Pack Format"

    Before continuing here, make sure to familiarize yourself with the
    [Minecraft Resource Pack Format](https://minecraft.wiki/w/Resource_pack#Pack_format) if you haven't already.

All assets intended for the resource pack should be placed in `src/main/resources/assets/`.  
Nova will automatically read and extract assets from the following subdirectories into the final resource pack:

- `atlases/` - [Wiki](https://minecraft.wiki/w/Resource_pack#Atlases)
- `textures/` - [Wiki](https://minecraft.wiki/w/Resource_pack#Textures)
- `models/` - [Wiki](https://minecraft.wiki/w/Resource_pack#Models) (unused models will not be included)
- `lang/` - [Wiki](https://minecraft.wiki/w/Resource_pack#Language)
- `fonts/` - [Wiki](https://minecraft.wiki/w/Resource_pack#Fonts)
- `sounds/` and `sounds.json` - [Wiki](https://minecraft.wiki/w/Resource_pack#Sounds)

## Models

For creating custom block models, we recommend using [Blockbench](https://blockbench.net/).  
For [entity-backed blocks](../blocks/creating-blocks.md#model-backing), Nova allows you to create oversized models.
If you want to take advantage of this, you'll need to deactivate Blockbench's size limit:

![](https://i.imgur.com/cbjOKZr.png){width=50%}

## Language Files

Language files belong in the `lang` folder.
The format for these files is the same the one minecraft uses.
If you need the locale code for a language, you can search for it [here](https://minecraft.wiki/w/Language).

!!! warning

    **Make sure to use the "in-game" locale code since ISO-639-3 isn't implemented by Minecraft (yet?)**

For English (United States), create a file called ``en_us.json`` in the ``lang`` folder. The format ``[<type>].<namespace/addon-id>.<item>``
should be used for the translations keys. The type can be left out if it's a generic message. In general, the following
types should be used:

* ``item`` - For translations related to items
* ``block`` - For translations related to blocks
* ``menu`` - For GUI related translations
* ``inventory`` - For inventory names
* ``container`` - For fluid container names
* ``command`` - For command responses
* ``advancement`` - For advancements

You can of course use your own type names, just make sure to include your addons namespace in the key.

```json
{
  "item.example_addon.ruby": "Ruby",
  "block.example_addon.solar_panel": "Solar Panel",
  "advancement.example_addon.ruby.title": "Ruby",
  "advancement.example_addon.ruby.description": "Acquire a ruby",
  "advancement.example_addon.solar_panel.title": "Clean Energy",
  "advancement.example_addon.solar_panel.description": "Craft a Solar Panel"
}
```