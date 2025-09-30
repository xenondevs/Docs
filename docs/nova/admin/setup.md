# Setting up Nova

Before installing Nova, please make sure that you're running a [supported server software](compatibility/index.md#compatible-server-software).  

!!! warning "Note that Nova changes some blocks in your world in order to implement custom blocks. This will cause certain blocks to lose functionality if you remove Nova again (e.g. note blocks resetting, leaves not decaying). Therefore, you should back up your server before installing Nova."

## Step 1: Installing Nova and addons

* Like any other plugin, the Nova plugin jar file downloaded from [Hangar](https://hangar.papermc.io/xenondevs/Nova), [Modrinth](https://modrinth.com/plugin/nova-framework), [GitHub](https://github.com/xenondevs/Nova) or our [Discord](https://discord.gg/hnEknVWvUe) just needs to be put in the ``plugins/`` folder of your server. Addons are also placed in the `plugins` folder.
    * Some addons might require other addons in order to work.
        If this is the case, an error in the console will notify you of the missing addons:  
        `Failed to initialize <Name of the Addon>: Missing addon(s): <Name(s) of the required addon(s) that are missing>`
* Add `-javaagent:plugins/<name of Nova jar>` to the JVM arguments (before `-jar`).
* Start your server and wait until Nova is done loading. (Indicated by the message in the console `[Nova] Done loading`). This creates config files and directories which you will need to access in the following steps.
* Stop your server.

The new resource pack containing the addon assets will be automatically generated, but it won't be sent to players yet.
Please follow Step 2 to configure resource pack hosting.

## Step 2: Configure resource pack hosting

Server resource packs need to be hosted on a web server in order to be sent to players. Because if this, you'll need to configure an auto uploader in `plugins/Nova/configs/config.yml` under `resource_pack` > `auto_upload`, which automatically uploads the resource packs to a web server.

!!! info "Available Upload Services"
    
    === "Self-hosted"
    
        If you're able to open a port on your server, this option will make the most sense for you.
        Nova will automatically start a lightweight web server from which the resource pack can be downloaded.
    
        Example config:
        
        ```yaml title="plugins/Nova/configs/config.yml"
        resource_pack:
          auto_upload:
            enabled: true
            service: self_host
            port: 38519 # The port on which the web server will be running, needs to be open to the Internet. (Defaults to 38519)
        ```
    
        !!! info "`host` parameter"
    
            You can also set the host of your server using the `host` parameter. If it is not set, the public ip address of your server gets used.
            If you are on a local server, you will need to set `host: 127.0.0.1` and add `append_port: true`.
    
        !!! warning "`append_port` parameter"
    
            When setting a `host`, Nova assumes that the configured port does not need to be appened after the host in the download URL.
            If this is not the case, set `append_port: true`.

    === "Custom Multipart Request"
    
        For more advanced users, Nova can also perform a multipart request to a server of your choice and parse the response using a regex.

        Example: [upload php script](https://gist.github.com/NichtStudioCode/d3e799bd59f53431bc67b2881df3b094)

        ```yaml title="plugins/Nova/configs/config.yml"
        resource_pack:
          auto_upload:
            enabled: true
            service: custom_multi_part
            url: https://example.com/upload/
            file_part_name: pack
            extra_params:
              key: "" # This key also needs to be set in the php script mentioned above
            url_regex: (.*) # The regex to parse the response, the first capturing group is used as the download URL. (Defaults to (.*))
        ```

    === "S3"

        If you are using Amazon S3 or any other cloud object storage with an S3-compatible API, you can use the S3 service to upload the resource pack. **You have to expose your S3 
        bucket to the Internet yourself.**

        Example config:
        
        ```yaml title="plugins/Nova/configs/config.yml"
        resource_pack:
          auto_upload:
            enabled: true
            service: s3
            endpoint: s3.amazonaws.com # The endpoint of your S3 service
            region: eu-central-1 # The region of your S3 endpoint
            bucket: examplebucket # The name of your S3 bucket
            key_id: "" # Your S3 key id
            key_secret: "" # Your S3 key secret
            # -- optional parameters --
            acl: public-read # The ACL to use for the uploaded file (Defaults to none)
            force_path_style: false # Forces path style URLs (Defaults to false)
            disable_chunked_encoding: false # Disables chunked encoding (Defaults to false)
        ```

## (optional) resource pack merging

This step is only required if your server is already using a custom resource pack.

In the past, there could be only one server resource pack. While this is no longer the case, resource pack
merging is still important as Nova uses it to analyze the existing resource pack and adjusts its own data accordingly
to prevent conflicts.  
**Therefore, it is NOT possible to manually merge resource packs, and it is also NOT possible to use merging services from other plugins.**

You can define "base packs", which are resource packs that Nova should merge, in two ways:  

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
