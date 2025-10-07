## Adding compatibility with Nexo

To make Nexo and Nova work together, you need to follow these steps:

1. Disable Nexo's resource pack upload in its `settings.yml`
2. Add the Nexo resource pack zip file as a [base pack](../setup.md#optional-resourcepack-merging) in Nova's main config.
3. Regenerate Nova's resource pack with `/nova resourcePack build`

## Known Issues

* Duplicated and wrong block sounds