## Adding compatibility with ItemsAdder

To make ItemsAdder and Nova work together, you need to follow these steps:

1. Change the following values in the ItemsAdder `config.yml`:
    - Set `resource_pack.hosting.no-host.enabled` to `true` (all other options under hosting must be `false`).
    - Set `resource_pack.zip.protect-file-from-unzip.enabled` to `false`
3. Add the ItemsAdder resource pack zip file as a [base pack](../setup.md#optional-resourcepack-merging) in Nova's main config.
4. Regenerate Nova's resource pack with `/nova resourcePack create` (make sure that you've run `/iazip` before and the resource pack zip exists)

## Adding new assets to ItemsAdder

After adding new assets to ItemsAdder and running `/iazip`, you will now also need to run `/nova resourcePack create`.
