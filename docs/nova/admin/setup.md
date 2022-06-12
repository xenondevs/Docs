# Setting up Nova

## Step 1: Plugin Installation

* Just like any other plugin, the plugin jar file downloaded from [SpigotMC](https://www.spigotmc.org/resources/93648/) or our [Discord](https://discord.gg/hnEknVWvUe) just needs to be put in the ``plugins/`` folder of your server.
* Start your server and wait until Nova is done loading. (Indicated by the message in the console ``[Nova] Done loading`). This creates config files and directories which you will need to access in the following steps.
* Stop your server.

!!! warning

    Nova v0.9 is not compatible with earlier versions of Nova. If you're updating from an earlier version, make sure to delete the ``plugins/Nova`` folder and remove all items / blocks from your world.

## Step 2: ResourcePack Hosting

Due to the way custom resource packs work, it is required to upload them to a web server first before they can be sent to players.
Nova has a built-in way to automatically upload the resource pack after it changes.

The auto-uploader can be configured in the main config file ``plugins/Nova/configs/config.yml`` under ``resource_pack.auto_upload``.

### Patreon Upload Service

[Patrons](https://www.patreon.com/xenondevs) are given access to upload to our servers.
Due to hosting costs and the potential for abuse, this service is only available to Patrons and not available publicly.

Example config:
```yml
auto_upload:
  enabled: true
  service: xenondevs
  key: "" # Your Patreon-Uploader Key
```

### Self-hosted

If you're able to open a port on your server, this option will make the most sense for you.
Nova will automatically start a lightweight web server from which the resource pack can be downloaded.

Example config:
```yml
auto_upload:
  enabled: true
  service: SelfHost
  port: 12345 # The port on which the server will be running, needs to be open to the Internet.
```

??? info "Optional Parameters"

        You can also set the host of your server using the ``host`` parameter. If it is not set, the public ip address of your server gets used.

### Custom Multipart Request (advanced)

For more advanced users, Nova can also perform a multipart request to a server of your choice and parse the response using a regex.

For [this php script](https://gist.github.com/ByteZ1337/6582b8c31789602119c55770cb095455), the config would be the following:
```yml
url: https://example.com/upload.php
filePartName: pack
extraparams:
  key: "" # This key also needs to be set in the php script mentioned above
```

If the response of your uploader is in a different format such as JSON, you will need to set the ``urlRegex`` parameter which encloses the URL in the first group of the first match.
For example, for a response like this ``{"state":"success", "url":"https://example.com/ResourcePack.zip"}``, the regex could be ``"url":"([\w:/\.]*)``.

## Step 3: Installing addons

To install an addon:
* Stop the server
* Drag & drop the addon jar file into ``plugins/Nova/addons/``
* Start the server again

The new resource pack will be automatically generated and uploaded using the configured auto-uploader.