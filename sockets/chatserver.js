var _ = require("lodash");

var User = function (args) {
  var self = this;

  self.socket = args.socket;
  self.user = args.user;
};

var Server = function (io) {
  var self = this;

  self.io = io;
  self.users = [];

  self.init = function () {
    self.io.on("connection", function (socket) {
      self.handleConnection(socket);
    });
  };

  self.checkUser = function (username) {
    var errors = {
      small: "El nick no puede tener menos de 3 letras",
      white: "El nick no puede contener espacios",
      alpha: "El nick solo puede contener letras",
      exist: "Ese nick ya esta siendo usado",
    };

    if (!username || username.length < 3) return errors.small;

    if (username.indexOf(" ") !== -1) return errors.white;

    var match = /[\w]+/.exec(username)[0];
    var alpha = match.length === username.length;

    if (!alpha) return errors.alpha;

    var exist = _.some(self.users, function (item) {
      return item.user === username;
    });

    if (exist) return errors.exist;
  };

  self.handleConnection = function (socket) {
    console.log("\nuser connected !\n");

    socket.on("login", function (username) {
      var error = self.checkUser(username);

      if (error) {
        socket.emit("errorToast", error);
        return;
      }

      var newUser = new User({
        socket: socket,
        user: username,
      });

      self.users.push(newUser);
      self.addResponseListeners(newUser);
      socket.emit("welcome");
      socket.broadcast.emit("newUser", newUser.user);
    });
  };

  self.addResponseListeners = function (user) {
    user.socket.on("disconnect", function () {
      self.users.splice(self.users.indexOf(user), 1);
      self.io.emit("userLeft", user.user);
    });

    user.socket.on("onlineUsers", function () {
      /* this is to hidde your self and see only oders conected users 
        _.filter(_.pluck(self.users, 'user'), function(name) {
            return name !== user.user;
        });
        */
      user.socket.emit("onlineUsers", _.pluck(self.users, "user"));
    });

    user.socket.on("chat", function (message) {
      if (!message) return;

      var newMsg = {
        message: message,
        type: "foreign",
        sender: user.user,
      };

      user.socket.broadcast.emit("chat", newMsg);
      newMsg.type = "self";
      user.socket.emit("chat", newMsg);
    });

    user.socket.on("onChat", function () {
        self.io.emit("onChat", user.user);
    });
  };
};

module.exports = Server;
