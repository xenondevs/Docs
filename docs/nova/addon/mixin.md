Mixins are a powerful way to modify existing code of the Minecraft server. Nova uses [Mixin](https://github.com/SpongePowered/Mixin) + [MixinExtras](https://github.com/LlamaLad7/MixinExtras/) and [Origami](https://github.com/xenondevs/origami) as mixin loader.

For an improved development experience when creating Mixins, we recommend installing the [Minecraft Development](https://plugins.jetbrains.com/plugin/8327-minecraft-development) IntelliJ plugin.

Additionally, you can enable mixin debug output by setting the `mixin.debug` system property to `true` (`-Dmixin.debug=true`).

## Getting started

To get started, create a `<addon_id>.mixins.json` file in `src/main/resources`:
```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "org.example.mixin", // (1)!
  "mixins": [], // (2)!
  "mixinextras": {
    "minVersion": "0.5.0"
  }
}
```

1. Path to the package containing your mixin classes. This package should not contain any other non-mixin classes.
2. List of relative paths to mixin classes inside your mixin package. The Minecraft Development plugin can populate this list for you.

Then, you can start creating mixins. Note that mixins should be written in Java, so you'll need to place them in `src/main/java` instead of `src/main/kotlin`, or make `src/main/kotlin` a Java sources root.

The following example mixin injects a call to `#!java System.out.println("Hello world!")` at the start of the `tickServer` method in `MinecraftServer`:

```java
package org.example.mixin;

import net.minecraft.server.MinecraftServer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(MinecraftServer.class)
abstract class ExampleMixin {
    
    @Inject(method = "tickServer", at = @At("HEAD"))
    private void onTickServer(CallbackInfo ci) {
        System.out.println("Hello world!");
    }
    
}
```

```diff
{
  "required": true,
  "minVersion": "0.8",
  "package": "org.example.mixin",
- "mixins": []
+ "mixins": ["ExampleMixin"],
  "mixinextras": {
    "minVersion": "0.5.0"
  }
}
```

## Limitations

Since your addon's classes and the Minecraft server's classes are not loaded by the same classloader, Mixins cannot directly reference addon classes. Origami solves this problem by replacing calls to your addon's classes with invokedynamic instructions that will then link to the correct class at runtime. Because of this, some Mixin features are currently not supported or may not work correctly. Most notably, injecting interfaces will not work.

## Further reading

You can refer to the following sources for a more in-depth Mixin tutorial:

- [Mixin Wiki](https://github.com/SpongePowered/Mixin/wiki)
- [MixinExtras Wiki](https://github.com/LlamaLad7/MixinExtras/wiki)
- [Fabric - Mixin Tutorial](https://wiki.fabricmc.net/tutorial:mixin_introduction)
- [mixin-wiki.readthedocs.io](https://mixin-wiki.readthedocs.io/)