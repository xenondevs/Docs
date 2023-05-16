## Adding compatibility with Oraxen

To make Oraxen and Nova work together, you need to follow these steps:

1. Change the following values in Oraxen's `settings.yml`:
    - Set `Pack` > `upload` > `enabled` > to `false`
    - Under `Pack`> `dispatch` set `send_pack` and `send_on_reload` to `false`
2. Add the Oraxen resource pack zip file as a [base pack](../setup.md#optional-resourcepack-merging) in Nova's main config.
3. Regenerate Nova's resource pack with `/nova resourcePack create` (make sure that you've run `/o reload pack` before and the resource pack zip exists)

## Using the Oraxen Upload Service

You can use Oraxen's upload service to automatically upload the resource pack.  
[Resource Pack Hosting - Available Upload Services](../setup.md#__tabbed_1_5)

## Known Issues

* Duplicated and wrong block sounds