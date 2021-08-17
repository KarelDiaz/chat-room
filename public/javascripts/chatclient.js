$(function () {
  var socket = io.connect(window.location.origin);

  var chat = ChatManager(),
    userManager = UserManager();

  var sound = SoundManager();

  $(".chat").perfectScrollbar();

  toastr.options = {
    closeButton: true,
    timeOut: 3000,
  };

  $(".modal").modal({
    backdrop: "static",
  });

  $("#setName").click(function () {
    socket.emit("login", $("#username").val());
  });
  $("#username").keyup(function (ev) {
    if (ev.type === "keyup" && ev.which === 13) $("#setName").click();
  });

  socket.on("errorToast", function (message) {
    toastr.error(message, "wrong username !");
  });

  socket.on("welcome", function () {
    sound.init();
    chat.init();
    socket.emit("onlineUsers");
  });

  $("#sender").submit(function (ev) {
    ev.preventDefault();
    var $message = $("#message");
    socket.emit("chat", $message.val());
    $message.val("").focus();
  });

  socket.on("chat", function (data) {
    sound.play(3);
    chat.update(data.message, data.type, data.sender);
  });

  socket.on("onlineUsers", function (users) {
    userManager.init(users);
    chat.update("Hay " + users.length + " usuarios conectados");
  });

  $("#message").keydown(function () {
    socket.emit("onChat");
  });

  socket.on("onChat", function (user) {
    userManager.onChat(user);
  });

  socket.on("onlineUsers", function (users) {
    userManager.init(users);
    chat.update("Hay " + users.length + " usuarios conectados");
  });

  socket.on("newUser", function (user) {
    userManager.add(user);
    chat.update(user + " se unio a la conversacion");
  });

  socket.on("userLeft", function (user) {
    userManager.remove(user);
    chat.update(user + " salio de la conversacion");
  });

  $(".chat ul").on("click", ".foreign span.label-info", function (ev) {
    var target = "@" + $(this).text();
    $("#message")
      .val(target + " ")
      .focus();
  });
  let bg = 'url("../images/bg/bg' + Math.round(Math.random() * 8) + '.jpg")';
  $(".body-content").css({ "background-image": bg });
});
