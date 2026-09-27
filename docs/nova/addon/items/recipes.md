---
icon: lucide/cooking-pot
---

# Recipes

## Adding recipes to your addon
Recipes files are placed under `recipes/<namespace>/type`, where the `namespace` is the namespace of the addon that registered this recipe type (`minecraft` for Minecraft recipe types) and `type` the name of the recipe type.  
For more information about the recipe format and default recipe types, [read the admin page on it](../../admin/recipes/index.md).

## Creating a custom Recipe Type
Recipe types are registered using `ExampleAddon.registerRecipeType` during `InitStage.PRE_WORLD`.

All the following values are required to create a new `RecipeType`:

|      Name      |           Type           | Usage                                                                                                         |
|:--------------:|:------------------------:|---------------------------------------------------------------------------------------------------------------|
|     `name`     |         `String`         | The name of your recipe type and its directory.                                                               |
| `recipeClass`  |       `KClass<T>`        | The class of your recipe type, must be a subclass of `NovaRecipe`.                                            |
|    `group`     |    `RecipeGroup<in T>`   | The recipe group that displays the recipe in the recipe explorer gui.                                         |
| `deserializer` | `RecipeDeserializer<T>?` | The deserializer that deserializes the recipe files to an instance of the previously specified `recipeClass`. |

```kotlin
@Init(stage = InitStage.PRE_WORLD)
object RecipeTypes {

    val PULVERIZER by ExampleAddon.registerRecipeType(
        "pulverizer", PulverizerRecipe::class, PulverizingRecipeGroup, PulverizerRecipeDeserializer
    )

}
```

Delegating with `by` resolves the registered recipe type when it is accessed.

!!! example "Creating a custom Recipe Type"

    === "Recipe Class"
        
        Every recipe that is created also creates a new instance of the `recipeClass`. That object then contains all the information about the recipe (e.g. Input, Output, Time, etc.).

        The following example is the `PulverizerRecipe` from the Machines addon:  
        ```kotlin title="PulverizerRecipe"
        class PulverizerRecipe(
            key: Key,
            input: RecipeChoice,
            result: ItemStack,
            time: Int,
        ) : ConversionNovaRecipe(key, input, result, time) {
            override val type = RecipeTypes.PULVERIZER
        }
        ```
        Since a Pulverizer just converts one input item to another output item, I could use the pre-existing `ConversionNovaRecipe`. Depending on your recipe type, you might need to directly inherit from `NovaRecipe` though.

    === "Recipe Deserializer"

        The recipe deserializer deserializes the recipe file to an instance of the `recipeClass`.

        For the `PulverizerRecipe` from Machines, the recipe deserializer is actually quite easy, as you can just extend the already existing `ConversionRecipeDeserializer`:  
        ```kotlin title="PulverizerRecipeDeserializer"
        object PulverizerRecipeDeserializer : ConversionRecipeDeserializer<PulverizerRecipe>() {
            override fun createRecipe(json: JsonObject, key: Key, input: RecipeChoice, result: ItemStack, time: Int) =
                PulverizerRecipe(key, input, result, time)
        }
        ```

        However, depending on you recipe type you might need to do some more work. The following deserializer is used for the fluid infuser recipe:
        ```kotlin title="FluidInfuserRecipeDeserializer"
        object FluidInfuserRecipeDeserializer : RecipeDeserializer<FluidInfuserRecipe> {
    
            override fun deserialize(json: JsonObject, file: File): FluidInfuserRecipe {
                val mode = FluidInfuserRecipe.InfuserMode.valueOf(json.getString("mode"))
                val fluidType = FluidType.valueOf(json.getString("fluid_type"))
                val fluidAmount = json.getLong("fluid_amount")
                val input = parseRecipeChoice(json.get("input"))
                val time = json.getInt("time")
                val result = ItemUtils.getItemStack(json.getString("result"))
        
                return FluidInfuserRecipe(getRecipeKey(file), mode, fluidType, fluidAmount, input, result, time)
            }

        }
        ```

        !!! info

            Make sure to always use the `parseRecipeChoice(JsonElement)`, `ItemUtils.getItemStack(String)` and `getRecipeKey(File)` utility methods instead of using your own logic.

    === "Recipe Group"

        The recipe group is only used for the recipe explorer GUI. It is required when registering a recipe type.

        As always, it is very easy to create a recipe group for conversion recipes:
        ```kotlin title="PulverizingRecipeGroup"
        object PulverizingRecipeGroup : ConversionRecipeGroup<PulverizerRecipe>() {
            override val priority = 4 // (1)!
            override val icon = Items.PULVERIZER.guiItemProvider // (2)!
            override val texture = GuiTextures.RECIPE_PULVERIZER // (3)!
        }
        ```
        
        1. The priority defines where in the recipe explorer your recipe type is going to be. (Lower value -> left | Higher value -> right)
        2. The icon displayed for your recipe type.
        3. The GUI Texture used when displaying your recipe type.

        However, if your recipe is not a `ConversionNovaRecipe`, your recipe group might be a bit more work:  
        (The resulting GUI needs to be in the dimensions `9x3`)

        ```kotlin title="FluidInfuserRecipeGroup"
        object FluidInfuserRecipeGroup : RecipeGroup<FluidInfuserRecipe>() {
            
            override val texture = GuiTextures.RECIPE_FLUID_INFUSER
            override val icon = Items.FLUID_INFUSER.guiItemProvider
            override val priority = 6
            
            override fun createGui(recipe: FluidInfuserRecipe) = gui(
                ". f . . . . . . .",
                ". f p i . t . r .",
                ". f . . . . . . ."
            ) {
                'i' by createRecipeChoiceItem(recipe.input) // (1)!
                'r' by createRecipeChoiceItem(listOf(recipe.result))
                'p' by itemProvider(
                    if (recipe.mode == FluidInfuserRecipe.InfuserMode.INSERT) GuiItems.FLUID_PROGRESS_LEFT_RIGHT.guiItemProvider
                    else GuiItems.FLUID_PROGRESS_RIGHT_LEFT.guiItemProvider
                ) {
                    name by Component.translatable(
                        "menu.machines.recipe.${recipe.mode.name.lowercase()}_fluid",
                        Component.text(recipe.fluidAmount),
                        Component.translatable(recipe.fluidType.localizedName)
                    )
                }
                'f' by fluidBar(provider(recipe.fluidType), provider(recipe.fluidAmount), provider(FLUID_CAPACITY))
                't' by itemProvider(DefaultGuiItems.INVISIBLE_ITEM.guiItemProvider) {
                    name by Component.translatable("menu.nova.recipe.time", Component.text(recipe.time / 20.0))
                }
            }
        
        }
        ```
        
        1. This function creates an InvUI item for a `RecipeChoice`. When clicked, it shows you recipes / usages for that item. It also automatically cycles through all possible input options if there is more than one.

        `FLUID_CAPACITY` is the maximum amount of fluid shown by the bar, for example `10_000L`.

        [:material-file-document-outline: InvUI Documentation](../../../../invui/){ .md-button }
