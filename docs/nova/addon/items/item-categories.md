# Item Categories

In order for your items to appear in the `/nova items`, they need to be in the `item_categories.yml` file in your addon resources.

## File Structure

The structure of the `item_categories.yml` file is as follows:  

```yaml
example_category: # (1)!
  icon: example_addon:example_item # (2)!
  name: "menu.example_addon.items.category.example_category" # (3)!
  priority: 0 # (4)!
  items: # (5)!
    - example_addon:example_item
    - example_addon:other_item
```

1. The id of the category. This can be useful if you want to add items to an existing category, such as `misc` from Nova
   or `machines`, `power` or `crafting` from Machines.
2. The tab icon in the `/nova items` GUI.
3. The tab name in the `/nova items` GUI.
4. Tabs of categories with a lower priority will be to the left of tabs of categories with a higher priority.
5. The items that will be listed under that category in the `/nova items` GUI.

You can register as many item categories as you want.

!!! info

      It is possible to add items to existing categories by just using the same category id. When multiple addons define the
      same category, the addon loaded first sets the icon, name and priority.