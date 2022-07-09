## Adding compatibility with ItemsAdder

To make ItemsAdder and Nova work together, you need to follow these steps:

1. Disable your current auto hoster in the ItemsAdder config and enable `no-host`.
2. Add the ItemsAdder resource pack zip file as a [base pack](../setup.md#optional-resourcepack-merging) in Nova's main config.
3. Regenerate Nova's resource pack with `/nova resourcePack create` (make sure that you've run `/iazip` before and the resource pack zip exists)

## Adding new assets to ItemsAdder

After adding new assets to ItemsAdder and running `/iazip`, you will now also need to run `/nova resourcePack create`.