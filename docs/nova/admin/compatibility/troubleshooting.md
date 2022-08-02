# Troubleshooting

## Solid blocks

If another plugin on your server adds custom blocks that aren't armor stand based (e.g. mushroom, noteblock), their logic
might interfere with Nova's logic. If this is the case, you might want to disable solid blocks in Nova.

### Disabling solid blocks

1. Set `use_solid_blocks` to `false` in `plugins/Nova/configs/config.yml`
2. Reload the configs or restart your server
3. Regenerate the resource pack with `/nova resourcePack create`
4. Restart your server

### Re-enabling solid blocks

1. Set `use_solid_blocks` to `true` in `plugins/Nova/configs/config.yml`
2. Reload the configs or restart your server
3. Regenerate the resource pack with `/nova resourcePack create`
4. Run `/nova debug updateChunkSearchId`
5. Restart your server

### Why should I not disable solid blocks?

Solid blocks have a huge performance benefit compared to armor stand blocks, as the Minecraft client renders them like
normal blocks instead of entities. Solid blocks should only be disabled as a last resort.