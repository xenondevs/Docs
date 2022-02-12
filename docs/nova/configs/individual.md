# Individual Configs
There also exist configs for the all individual machines. These will allow you to configure processing speeds, power consumption and more.  
You can find them under ``plugins/Nova/config/machine``. Even though it is not a machine, the config for the jetpack is also in this folder.

## Upgrade Modifiers
You can also set upgrade modifiers for specific machines.  
This is done in the exact same way as in the main config, just inside the specific config for that machine.  
If you only want to change one specific modifier, you can leave out all the other ones to use their default values from the main config.  
The following config would give a range expansion of 2 blocks for each upgrade and set the maximum amount of upgrades to 15.
```json
"upgrade_modifiers": {  
  "range": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
}
```
