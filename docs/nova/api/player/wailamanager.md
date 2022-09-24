# WailaManager

The WailaManager allows you to enable / disable the WAILA overlay for players.

=== "Kotlin"

    ```kotlin
    // Get the current state
    val enabled = wailaManager.getState(player)

    // Enable the WAILA overlay
    wailaManager.setState(player, true)
    // Disable the WAILA overlay
    wailaManager.setState(player, false)
    ```

=== "Java"

    ```java
    // Get the current state
    boolean enabled = wailaManager.getState(player);

    // Enable the WAILA overlay
    wailaManager.setState(player, true);
    // Disable the WAILA overlay
    wailaManager.setState(player, false);
    ```