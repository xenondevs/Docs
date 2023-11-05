# Setting up Nova

## Step 1: Plugin Installation

* Like any other plugin, the Nova plugin jar file downloaded from [Hangar](https://hangar.papermc.io/xenondevs/Nova), [Modrinth](https://modrinth.com/plugin/nova-framework), [GitHub](https://github.com/xenondevs/Nova) or our [Discord](https://discord.gg/hnEknVWvUe) just needs to be put in the ``plugins/`` folder of your server.
* Start your server and wait until Nova is done loading. (Indicated by the message in the console `[Nova] Done loading`). This creates config files and directories which you will need to access in the following steps.
* Stop your server.

!!! bug "**Do NOT put addons in the plugins folder**"

    Nova addons are not plugins and won't load in the `plugins/` folder.  
    Please follow Step 2 to install addons.

## Step 2: Installing addons

To install an addon:

* Stop the server
* Drag & drop the addon jar file into ``plugins/Nova/addons/``
* Start the server again

The new resource pack containing the addon assets will be automatically generated, but it won't be sent to players yet.  
Please follow Step 3 to configure resource pack hosting.

!!! info

    Some addons might require other addons in order to work. If this is the case, an error in the console will notify you of the missing addons: `Failed to initialize <Name of the Addon>: Missing addon(s): <Name(s) of the required addon(s) that are missing>`

## Step 3: Configure resource pack hosting

Due to the way server resource packs work, it is required to upload them to a web server first before they can be sent to players.  
This can be done either automatically or manually:

=== "Automatic resource pack hosting (recommended)"

    The auto uploader automatically uploads the  resource pack after it changes.
    You can configure it in the main config file `plugins/Nova/configs/config.yml` under `resource_pack` > `auto_upload`.
    
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
                service: self_host
                port: 12345 # The port on which the web server will be running, needs to be open to the Internet.
            ```
        
            !!! info "`host` parameter"
        
                You can also set the host of your server using the `host` parameter. If it is not set, the public ip address of your server gets used.
                If you are on a local server, you will need to set `host: 127.0.0.1`
        
            !!! warning "`append_port` parameter"
        
                When setting a `host`, Nova assumes that the configured port does not need to be appened after the host in the download URL.
                If this is not the case, set `append_port: true`.
    
        === "Custom Multipart Request"
        
            For more advanced users, Nova can also perform a multipart request to a server of your choice and parse the response using a regex.
 
            Example: [upload php script](https://gist.github.com/ByteZ1337/6582b8c31789602119c55770cb095455)
    
            ```yaml title="plugins/Nova/configs/config.yml"
            resource_pack:
              auto_upload:
                enabled: true
                service: custom_multi_part
                url: https://example.com/upload.php
                filePartName: pack
                extraParams:
                  key: "" # This key also needs to be set in the php script mentioned above
            ```
        
        === "Amazon S3"
    
            If you are using Amazon S3, you can use the S3 service to upload the resource pack. **You have to expose your S3 
            bucket to the Internet yourself.**
    
            Example config:
            
            ```yaml title="plugins/Nova/configs/config.yml"
            resource_pack:
              auto_upload:
                enabled: true
                service: amazon_s3
                endpoint: s3.amazonaws.com # The endpoint of your S3 service
                region: eu-central-1 # The region of your S3 endpoint
                bucket: examplebucket # The name of your S3 bucket
                key_id: "" # Your S3 key id
                key_secret: "" # Your S3 key secret
            ```
    
        === "Oraxen"
    
            If you are using Oraxen on your server, you can configure Nova to use the PolyMath instance [configured in Oraxen's config.yml](https://docs.oraxen.com/configuration/plugin-settings#upload).
    
            Example config:
            
            ```yaml title="plugins/Nova/configs/config.yml"
            resource_pack:
              auto_upload:
                enabled: true
                service: oraxen
            ```

=== "Manual resource pack hosting"

    For manual resource pack hosting, upload the resource pack found under `plugins/Nova/resource_pack/ResourcePack.zip` to a file uploader of your choice.
    Then set the url to download the resource pack in the main config file `plugins/Nova/configs/config.yml` under `resource_pack` > `url`:
    
    ```yaml title="plugins/Nova/configs/config.yml"
    resource_pack:
      url: https://example.com/resource_pack.zip
    ```
    
    !!! warning "URL needs to be a direct download link"

        Minecraft requires the server resource pack to be a direct download link, meaning it
        cannot have any redirects or visual elements (like buttons, text, etc.) on the page.
        Direct download links often include the file name and extension in the url, so for
        resource packs, they would end with `.zip`.

    !!! bug "Prefer using an auto-upload service instead"
    
        You will need to manually re-upload the resource pack every time it is regenerated, which is when you update Nova,
        any of its addons or when you change config values that affect resource pack generation.  
        **This is why you should prefer using an auto-upload service instead.**

## (optional) resource pack merging

This step is only required if your server is already using a custom resource pack.

Due to technical limitations, it is only possible to have one server resource pack.
To circumvent this issue, Nova can automatically merge existing resource packs with its own.
Additionally, Nova also analyzes the existing resource pack and adjust its own data accordingly to prevent conflicts.
**Therefore, it is NOT possible to manually merge resource packs, and it is also NOT possible to use merging services from other plugins.**

There are two ways to define base packs:  

=== "With Config"

    1. Make sure to turn off the resource pack prompt in the config of the plugin providing it.
    2. Link to the resource pack directory or zip file in the Nova config under `resource_pack` > `generation` > `base_packs`.

        ```yaml title="plugins/Nova/configs/config.yml"
        resource_pack:
          generation:
            base_packs:
              - plugins/ItemsAdder/output/generated.zip
        ```

    3. Make sure that the listed base pack has been properly generated. (For example, ItemsAdder requires running ``/iazip`` to generate its resource pack.)
    4. Reload the config using `/nova reload configs` or restart the server.
    5. Regenerate the resource pack using `/nova resourcePack create`.

=== "With Folder"

    1. Make sure to turn off the resource pack prompt in the config of the plugin providing it.
    2. Copy the resource pack directory or zip file to `plugins/Nova/resource_pack/base_packs/`.
    3. Regenerate the resource pack using `/nova resourcePack create`.

!!! info "You can add as many base packs as you want."
