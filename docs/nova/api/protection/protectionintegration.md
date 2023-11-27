# ProtectionIntegration

If you want to add a custom protection integration for your own plugin, you can do so by implementing the 
``ProtectionIntegration`` interface. This interface provides a handful of methods that will be called by the 
``ProtectionManager``.

For an example of how to implement this interface, you can check out some of our 
[built-in protection integrations](https://github.com/xenondevs/Nova/tree/main/nova-hooks).

Once you have implemented the interface, you can register it with ``Nova.registerProtectionIntegration(ProtectionIntegration)``.
