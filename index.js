let plugin_name = "node-red-dashboard-2-authentik-auth";
module.exports = function (RED) {
  RED.plugins.registerPlugin(plugin_name, {
    // Tells Node-RED this is a Node-RED Dashboard 2.0 plugin
    type: "node-red-dashboard-2",

    hooks: {
      /**
       * onAddConnectionCredentials - called when a D2.0 is about to send a message in Node-RED
       * @param {object} conn - SocketIO connection object
       * @param {object} msg - Node-RED msg object
       * @returns {object} - Returns Node-RED msg object
       */
      onAddConnectionCredentials: (conn, msg) => {
        if (!msg._client) {
          console.log(
            `${plugin_name}: msg._client is not found, not adding user info. This sometimes happens when the editor is refreshed with stale connections to the dashboard.`
          );
          return msg;
        }
        var user = {};
        const headers = conn.request.headers;
        // Just for debugging ... 
        // console.warn(`${JSON.stringify(headers)}`)
        const authentik_user = headers["x-authentik-uid"] || null
        if (!authentik_user) {
          console.warn(
            `${plugin_name}: Session is not authenticated by Authentik; no user detected. See headers: ${JSON.stringify(
              headers
            )}`
          );
        } else {
          console.log(
            `${plugin_name}: Dashboard interacted with by ${authentik_user}`
          );
        }
        user.host = headers["host"] || null;
        user.agent = headers["user-agent"] || null;
        user.userId =  authentik_user
        user.name =  headers["x-authentik-name"] || null;
        user.userName =  headers["x-authentik-username"] || null;
        user.email = headers["x-authentik-email"] || null
        user.groups =  headers["x-authentik-groups"] || null;
        user.provider = "Authentik";
        msg._client["user"] = user;
        return msg;
      },
    },
  });
};
