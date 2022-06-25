# Recipes

## Adding recipes to your addon
Recipes files are placed under `recipes/<namespace>/type`, where the `namespace` is the namespace of the addon that
registered this recipe type (`minecraft` for Minecraft recipe types) and `type` the name of the recipe type.  
For more information about the recipe format and default recipe types, [read the admin page on it](../admin/recipes.md).

## Creating a custom Recipe Type
Recipe types are registered over the `RecipeTypeRegistry`.  
All of the following values are required to create a new `RecipeType`:

* `dirName: String` - The name for the directory of your recipe type.
* `recipeClass: KClass<T>` - The class of your recipe type, must be a subclass of `NovaRecipe`.
* `group: RecipeGroup` - The recipe group that displays the recipe in the recipe explorer gui. 
* `deserializer: RecipeDeserializer<T>` - The deserializer that deserializes the recipe files to an instance of the previously specified `recipeClass`

!!! warning

    While some of these values are nullable, setting them to null should only be done for testing and debugging purposes
    and they should never be null in a released build.

!!! example

    === "Recipe Class"
        
        Every recipe that is created also creates a new instance of the `recipeClass`. That object then contains
        all the information about the recipe (e.g. Input, Output, Time, etc.).

        The following example is the `PulverizerRecipe` from the Machines addon:  
        ```kotlin title="PulverizerRecipe"
        class PulverizerRecipe(
            key: NamespacedKey,
            input: RecipeChoice,
            result: ItemStack,
            time: Int,
        ) : ConversionNovaRecipe(key, input, result, time) {
            override val type = RecipeTypes.PULVERIZER
        }
        ```
        Since a Pulverizer just converts one input item to another output item, I could use the pre-existing
        `ConversionNovaRecipe`. Depending on your recipe type, you might need to directly inherit from `NovaRecipe` though.

    === "Recipe Deserializer"

        The recipe deserializer deserializes the recipe file to an instance of the `recipeClass`.

        For the `PulverizerRecipe` from Machines, the recipe deserializer is actually quite easy, as you can just
        extend the already existing `ConversionRecipeDeserializer`:  
        ```kotlin title="PulverizerRecipeDeserializer"
        object PulverizerRecipeDeserializer : ConversionRecipeDeserializer<PulverizerRecipe>() {
            override fun createRecipe(json: JsonObject, key: NamespacedKey, input: RecipeChoice, result: ItemStack, time: Int) =
                PulverizerRecipe(key, input, result, time)
        }
        ```

        However, depending on you recipe type you might need to do some more work. The following deserializer is used for
        the fluid infuser recipe:
        ```kotlin title="FluidInfuserRecipeDeserializer"
        object FluidInfuserRecipeDeserializer : RecipeDeserializer<FluidInfuserRecipe> {
    
            override fun deserialize(json: JsonObject, file: File): FluidInfuserRecipe {
                val mode = json.getDeserialized<FluidInfuserRecipe.InfuserMode>("mode")!!
                val fluidType = json.getDeserialized<FluidType>("fluid_type")!!
                val fluidAmount = json.getLong("fluid_amount")!!
                val input = parseRecipeChoice(json.get("input"))
                val time = json.getInt("time")!!
                val result = ItemUtils.getItemBuilder(json.getString("result")!!).get()
        
                return FluidInfuserRecipe(getRecipeKey(file), mode, fluidType, fluidAmount, input, result, time)
        }
        ```

        !!! info

            Make sure to always use the `parseRecipeChoice(JsonElement)`, `ItemUtils.getItemBuilder(String)` and`getRecipeKey(File)`
            utility methods when creating your recipe deserializer.

}