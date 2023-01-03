# Language Files

Everything in Nova has to be localized which is why language files are very important. To start off, create a folder
called``lang`` in your ``assets`` root folder. Here you can create language files for your addon. The format for these
files is the same the one minecraft uses. If you need the locale code for a language, you can search for
it [here](https://minecraft.fandom.com/wiki/Language).

!!! warning

    **Make sure to use the "in-game" locale code since ISO-639-3 isn't implemented by Minecraft yet**

To start off, create a file called ``en_us.json`` in the ``lang`` folder. The format ``[<type>].<namespace/addon-id>.<item>`` 
should be used for the translations keys. The type can be left out if it's a generic message. In general, the following 
types should be used:

* ``item`` - For translations related to items
* ``block`` - For translations related to blocks
* ``menu`` - For GUI related translations
* ``inventory`` - For VirtualInventory names
* ``container`` - For fluid container names
* ``command`` - For command responses
* ``advancement`` - For advancements

You can of course use your own type names, just make sure to include your addons namespace in the key.

```json
{
  "item.example.ruby": "Ruby",
  "block.example.solar_panel": "Solar Panel",
  "advancement.example.ruby.title": "Ruby",
  "advancement.example.ruby.description": "Acquire a ruby",
  "advancement.example.solar_panel.title": "Clean Energy",
  "advancement.example.solar_panel.description": "Craft a Solar Panel"
}
```