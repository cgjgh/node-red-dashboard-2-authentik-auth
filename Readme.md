# Node-RED Dashboard with Authentik Authentication

Use [Authentik](https://goauthentik.io/) as an authentication provider for the [Node-RED Dashboard 2](https://github.com/FlowFuse/node-red-dashboard).

<table align="center" style="border-collapse: collapse;">
  <tr>
    <td style="border: none;"><img src="assets/logo.png" alt="alt text" height="200px"/></td>
    <td style="font-size: 2em; vertical-align: middle; text-align: center; border: none;">+</td>
    <td style="border: none;"><img src="assets/authentik-orange.png" alt="alt text" height="200px"/></td>
  </tr>
</table>


This plugin assumes that you have a running Authentik instance and that you have configured it to use a forward auth [Proxy Provider](https://docs.goauthentik.io/docs/providers/proxy/) as an authentication provider for Node-RED. 

The proxy provider will set the appropiate headers necessary for Dashboard 2.0 to receive the user info from Authentik. 

| **User Info** | **Header** |
|---------------|------------|
| `provider` | `"Authentik"` |
| `host` | `host` |
| `agent` | `user-agent` |
| `userId` | `x-authentik-uid` |
| `name` | `x-authentik-name` |
| `userName` | `x-authentik-username` |
| `email` | `x-authentik-email` |
| `groups` | `x-authentik-groups` |



### Configuration
Configuring Authentik is out of scope of this plugin and will not be covered here in the immediate future.