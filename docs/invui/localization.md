# Localization

InvUI makes it easy for you to translate your GUIs into different languages.

## Adding translations

To add translations for a new language, you can call `Languages.getInstance().addLanguage(String lang, Map<String, String> translations)`.
The `lang` parameter is the language code of the language you want to add. The `translations` parameter should be a
map containing the translation keys and their translations.

If your translations are stored in a json structure like this:

```json title="en_us.json"
{
  "translation.key": "Hello World",
  "other.translation.key": "Hello World 2"
}
```

You can also load them using `Languages#loadLanguage`:

=== "Kotlin"

    ```kotlin
    Languages.getInstance().loadLanguage("en_us", File("en_us.json"), Charsets.UTF_8)
    ```

=== "Java"

    ```java
    Languages.getInstance().loadLanguage("en_us", new File("en_us.json"), StandardCharsets.UTF_8);
    ```

## Specifying Player language

By default, the player's locale is retrieved using `Player#getLocale()`. If you want to change this behavior, you can
do so by calling `Languages#setLanguageProvider`:

=== "Kotlin"

    ```kotlin
    Languages.getInstance().setLanguageProvider(Player::getLocale)
    ```

=== "Java"

    ```java
    Languages.getInstance().setLanguageProvider(Player::getLocale);
    ```

## Using translations

To use translations in your GUIs, simply use translatable components using either md_5's bungee component api or kyori's
adventure text api. If you're not using Kotlin and the `invui-kotlin` module, you'll need to wrap adventure components
using the `AdventureComponentWrapper` class before you can pass them to the `ItemBuilder` or `Window.Builder`.

!!! note

    Because it is not possible to set the display name or lore of `ItemStacks` to anything other than a String, you'll
    need to use InvUI's built-in `ItemBuilder` in order to apply translatable components.

## Disabling server-side translations

If you do not want your items and GUIs to be translated server-side and instead want to actually send translatable
components to your players, you can disable server-side translations by calling `Languages#enableServerSideTranslations(false)`.