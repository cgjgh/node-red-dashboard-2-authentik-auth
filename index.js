// function getUser(headers) {
//   var user = {};
//   const authentik_user = headers["x-authentik-uid"] || null;
//   if (!authentik_user) {
//     console.warn(`Session is not authenticated by Authentik; no user detected. See headers: ${JSON.stringify(headers)}`);
//   } else {
//     console.log(`Dashboard interacted with by ${authentik_user}`);
//   }
//   user.host = headers["host"] || null;
//   user.agent = headers["user-agent"] || null;
//   user.userId = authentik_user;
//   user.name = headers["x-authentik-name"] || null;
//   user.userName = headers["x-authentik-username"] || null;
//   user.email = headers["x-authentik-email"] || null;
//   user.groups = headers["x-authentik-groups"] || null;
//   user.provider = "Authentik";
//   return user;
// }

function getUser(headers) {
  var user = {
    host: "nodered-dashboard2.com",
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
    userId: "36b213236b2e163b708702848564c0194656165d28b9dd94be943d6e2ee5686e8c4",
    name: "Admin",
    userName: "akadmin",
    email: "admin@authentik.com",
    groups: "Admins|Standard Users",
    provider: "Authentik"
  };

  const authentik_user = user.userId;
  if (!authentik_user) {
    console.warn(`Session is not authenticated by Authentik; no user detected. See headers: ${JSON.stringify(headers)}`);
  } else {
    // console.log(`Dashboard interacted with by ${authentik_user}`);
  }

  return user;
}

let plugin_name = "node-red-dashboard-2-authentik-auth";
module.exports = function (RED) {
  RED.plugins.registerPlugin(plugin_name, {
    // Tells Node-RED this is a Node-RED Dashboard 2.0 plugin
    type: "node-red-dashboard-2",

    hooks: {
      onSetup: (config, req, res) => {
        var user = getUser(req.headers);
        return {
          socketio: {
            path: `${config.path}/socket.io`,
            withCredentials: true,
            auth: {
              user: user
            }
          }
        }
      },

      onAddConnectionCredentials: (conn, msg) => {
        if (!msg._client) {
          console.log(
            `${plugin_name}: msg._client is not found, not adding user info. This sometimes happens when the editor is refreshed with stale connections to the dashboard.`
          );
          // msg._client = {}  // flowfuse does this and continues execution to set user info below, not sure why.
          return msg;
        }

        var user = getUser(conn.request.headers);
        msg._client["user"] = user;
        return msg;
      },

      onIsValidConnection(conn, msg) {
        // check if the msg contains a specified user
        // if it does, does that user match the user in the connection?
        if (msg._client?.user) {
          var user = getUser(conn.request.headers);
          return msg._client.user.userId === user?.userId
        }
        return true
      },

      onCanSaveInStore(msg) {
        // check if the msg contains a specified user
        // if it does, then we can't save in general data store
        if (msg._client?.user) {
          return false
        }
        return true
      }
    },
  });
};
