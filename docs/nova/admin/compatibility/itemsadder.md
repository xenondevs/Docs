## Adding compatibility with ItemsAdder

To make ItemsAdder and Nova work together, you need to follow these steps:

1. Set the following values in the ItemsAdder `config.yml`:
    - `resource_pack.hosting.no-host.enabled` is set to `true` (All other options under hosting must be false).
    - `resource_pack.zip.protect-file-from-unzip.enabled` is set to `false` (Otherwise Zip exceptions will happen).
3. Add the ItemsAdder resource pack zip file as a [base pack](../setup.md#optional-resourcepack-merging) in Nova's main config.
4. Regenerate Nova's resource pack with `/nova resourcePack create` (make sure that you've run `/iazip` before and the resource pack zip exists)

## Adding new assets to ItemsAdder

After adding new assets to ItemsAdder and running `/iazip`, you will now also need to run `/nova resourcePack create`.
