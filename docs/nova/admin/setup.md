# Setting up Nova

## Step 1: Plugin Installation

* Like any other plugin, the Nova plugin jar file downloaded from [SpigotMC](https://www.spigotmc.org/resources/93648/) or our [Discord](https://discord.gg/hnEknVWvUe) just needs to be put in the ``plugins/`` folder of your server.
* Start your server and wait until Nova is done loading. (Indicated by the message in the console `[Nova] Done loading`). This creates config files and directories which you will need to access in the following steps.
* Stop your server.

!!! warning

    Nova v0.9 is not compatible with earlier versions of Nova. If you're updating from an earlier version, make sure to delete the ``plugins/Nova`` folder and remove all items and blocks from Nova from your world.

## Step 2: ResourcePack Hosting

Due to the way custom resource packs work, it is required to upload them to a web server first before they can be sent to players.  
You can do this either manually or automatically.

### Manual ResourcePack Hosting

For manual resource pack hosting, upload the resource pack found under ``plugins/Nova/resource_pack/ResourcePack.zip`` to a file uploader of your choice.
Then set the url to download the resource pack in the main config file ``plugins/Nova/configs/config.yml`` under ``resource_pack.url``:

```yaml title="plugins/Nova/configs/config.yml"
resource_pack:
  url: https://example.com/resource_pack.zip
```

!!! warning

    It is important that the url you set here is a **direct** download link.

### Automatic Resource Pack Hosting

You can also use Novas built-in way to automatically upload the resource pack after it changes.  
The auto-uploader can be configured in the main config file ``plugins/Nova/configs/config.yml`` under ``resource_pack.auto_upload``.

There are currently three main ways to configure the auto-uploader:

!!! info "Available Upload Services"

    === "Patreon Upload Service"
    
        [Patrons](https://www.patreon.com/xenondevs) are given access to upload to our servers.
        Due to hosting costs and the potential for abuse, this service is only available to Patrons and not available publicly.
    
        Example config:
        ```yaml title="plugins/Nova/configs/config.yml"
        resource_pack:
          auto_upload:
            enabled: true
            service: xenondevs
            key: "" # Your Patreon-Uploader Key
        ```
    
    === "Self-hosted"
    
        If you're able to open a port on your server, this option will make the most sense for you.
        Nova will automatically start a lightweight web server from which the resource pack can be downloaded.
    
        Example config:
        ```yaml title="plugins/Nova/configs/config.yml"
        resource_pack:
          auto_upload:
            enabled: true
            service: SelfHost
            port: 12345 # The port on which the server will be running, needs to be open to the Internet.
        ```
    
        !!! info "'host' parameter"
    
            You can also set the host of your server using the `host` parameter. If it is not set, the public ip address of your server gets used.
            If you are on a local server, you will need to set `host: 127.0.0.1`
    
        !!! warning "'portNeeded' parameter"
    
            When setting a `host`, Nova assumes that the configured port does not need to be appened after the host in the download URL.
            If this is not the case, set `portNeeded: true`.
    
    === "Custom Multipart Request (advanced)"
    
        For more advanced users, Nova can also perform a multipart request to a server of your choice and parse the response using a regex.
    
        For [this php script](https://gist.github.com/ByteZ1337/6582b8c31789602119c55770cb095455), the config would be the following:
        ```yaml title="plugins/Nova/configs/config.yml"
        resource_pack:
          auto_upload:
            enabled: true
            service: CustomMultiPart
            url: https://example.com/upload.php
            filePartName: pack
            extraparams:
              key: "" # This key also needs to be set in the php script mentioned above
        ```
    
        If the response of your uploader is in a different format such as JSON, you will need to set the ``urlRegex`` parameter which encloses the URL in the first group of the first match.
        For example, for a response like this 
        ```json
        {
          "state": "success",
          "url": "https://example.com/ResourcePack.zip"
        }
        ```
        the regex could be ``"url": "([\w:/\.]*)``.

## Step 3: Installing addons

To install an addon:

* Stop the server
* Drag & drop the addon jar file into ``plugins/Nova/addons/``
* Start the server again

The new resource pack will be automatically generated and uploaded using the configured auto-uploader.

!!! info

    Some addons might require other addons in order to work. If this is the case, an error in the console will notify you of the missing addons: `Failed to initialize <Name of the Addon>: Missing addon(s): <Name(s) of the required addon(s) that are missing`

## (optional) ResourcePack Merging

**This step is only required if your server is already using a custom resource pack.**

Due to technical limitations, it is only possible to have one server resource pack. To circumvent this issue, Nova can automatically merge existing resource packs with its own.  

Currently, there are two ways to define base packs:  

=== "With Config"

    * Make sure to turn off the custom resource pack in the config of the plugin providing it
    * Link to the resource pack directory or zip file in the Nova config under ``resource_pack.base_packs``

    Example:
    ```yaml title="plugins/Nova/configs/config.yml"
    resource_pack:
      base_packs:
        - plugins/ItemsAdder/data/resource_pack/pack.zip
    ```

    !!! info
    
        You can add as many base packs as you want.
    
        **Note:** Before building the resource pack with Nova, make sure that the listed base packs have been properly generated.
        For example, ItemsAdder requires running ``/iazip`` to generate its resource pack.

=== "With Folder"

    * Make sure to turn off the custom resource pack in the config of the plugin providing it
    * Copy the resource pack directory or zip file to `plugins/Nova/resource_pack/base_packs/`

        !!! info
    
            You can add as many base packs as you want.