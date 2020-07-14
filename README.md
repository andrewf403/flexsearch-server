
<a name="env"></a>
## Server Environment Variables

<table>
    <tr></tr>
    <tr>
        <td>Variable</td>
        <td>Values</td>
        <td>Default</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>PORT</td>
        <td>integer</td>
        <td>80&nbsp;(development)<br>6780&nbsp;(production)</td>
        <td>Server listening port</td>
    </tr>
    <tr></tr>
    <tr>
        <td>PORT_SSL</td>
        <td>integer</td>
        <td>443&nbsp;(development)<br>6781&nbsp;(production)</td>
        <td>Server listening port</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SSL</td>
        <td>true<br>false</td>
        <td>false</td>
        <td>Starts a HTTPS server (additionally to HTTP)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>FORCE_SSL</td>
        <td>true<br>false</td>
        <td>false</td>
        <td>Accept HTTPS connections only</td>
    </tr>
    <tr></tr>
    <tr>
        <td>COMPRESS</td>
        <td>true<br>false</td>
        <td>true</td>
        <td>Enable/Disable response compression (gzip)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>WORKER</td>
        <td>integer<br>"auto"</td>
        <td>"auto"</td>
        <td>Sets the number of workers or automatically determine available cpus</td>
    </tr>
    <tr></tr>
    <tr>
        <td>AUTOSAVE</td>
        <td>integer<br>false</td>
        <td>10000</td>
        <td>Enables persistent handler. Set the delay in milliseconds or disable by setting to <i>false</i></td>
    </tr>
</table>

<a name="config"></a>
## Configuration

When you do not pass any custom options, the environment will be inherited from _NODE_ENV_ by default.

Override the current environment (_NODE_ENV_) by adding a field in the root of `package.json`:

```json
  "flexsearch": "production" // development, test
```

Or add a config payload in the root of `package.json`:

> The field "client" holds the flexsearch options

```json
  "flexsearch": {
    "server": {
      "debug": true,
      "port": 80,
      "port_ssl": 443,
      "force_ssl": false,
      "https": true,
      "compress": true,
      "autosave": 2000,
      "worker": "auto"
    },
    "client": {
      "async": false,
      "cache": 0,
      "worker": 4
    }
  }
```

Or provide a config json file for each environment respectively and pass file locations:

> You can also provide a config json file to override the default settings globally.

```json
  "flexsearch": {
    "development": "config/development.json",
    "production": "config/production.json",
    "test": "config/test",
    "default": "config/default.json"
}
```

Or just provide a ___flexsearch.json___ in the root of your project.


<a name="ssl"></a>
## Setup SSL for HTTPS Connections

Inside the folder _cert_ add the certificate as a .crt file and the key as a .pem file for each environment respectively.

__Development Environment:__

_cert/development.crt_<br>
_cert/development.pem_

__Production Environment:__

_cert/production.crt_<br>
_cert/production.pem_

<a name="important"></a>
## Important Notes

You can increase workers without any drawbacks, but when you decrease worker count, the old index doesnt restore completely from the filesystem. This will be fixed in an upcoming version. As long please do not decrease worker count when using persistent index.

