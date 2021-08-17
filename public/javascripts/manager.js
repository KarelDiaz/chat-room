var UserManager = function () {
  var chating = false;

  function getTemplate(user) {
    var start = '<li id="' + user + '" class="user">';
    var img =
      '<img class="hidden-xs user-img img-responsive" src="images/fotos/' +
      user +
      '.png"/>';
    var userr = "<b>" + user + "</b>";
    var onChat =
      '<img class="hidden onchat-img" id="onchat' +
      user +
      '" width="20" height="20" src="images/onchat.png"/>';
    var fin = "</li>";
    return [start, img, userr, onChat, fin].join("");
  }

  function init(users) {
    $(".users ul").empty();
    users.forEach(this.add);
  }

  function add(user) {
    var template = getTemplate(user);
    $(template).appendTo($(".users ul"));
  }

  function remove(user) {
    var id = "#" + user;
    $(id).fadeOut().remove();
  }

  function onChat(user) {
    if (!chating) {
      chating = true;
      var id = "#onchat" + user;
      $(id).fadeOut(0);
      $(id).removeClass("hidden");
      $(id).fadeIn(1000);
      setTimeout(function () {
        offChat(user);
      }, 2000);
    }
  }

  function offChat(user) {
    var id = "#onchat" + user;
    $(id).addClass("hidden");
    chating = false;
  }

  return {
    init: init,
    add: add,
    remove: remove,
    onChat: onChat,
    offChat: offChat,
  };
};

var ChatManager = function () {
  function init() {
    $(".modal").modal("hide");
    $("#message").focus();
  }

  function processAtRespose(message) {
    if (message[0] === "@") {
      var target = /^@\w+/.exec(message)[0];
      var newMessage = "<span class=at-response>" + target + "</span>";
      message = message.replace(/^@\w+/, newMessage);
    }

    return message;
  }

  function getTemplate(message, type, sender) {
    var start = '<li class="message"><span class="message-content">';
    var date = '<b class="date">' + moment().format("H:mm") + " - </b>";

    var user = "";
    var divEnd = "</span>";
    if (type !== "server") {
      var label = type === "self" ? "default" : "danger";
      var img =
        '<img class="hidden-xs img-responsive chat-img" src="../images/fotos/' +
        sender +
        '.png">';
      user = '<div class="label label-' + label + '">' + sender + "</div>";
      message = "<span style='float:left'>" + processAtRespose(message) + "</span>";
    }

    var end = "</li>";

    return [start, date, img, user, divEnd,message, end].join("");
  }

  function update(message, type, sender) {
    var type = type || "server";
    var template = getTemplate(message, type, sender);

    var chat = $(".chat")[0];
    var atBottom = chat.scrollTop === chat.scrollHeight - chat.clientHeight;

    $(template).appendTo(".chat ul").fadeIn(300).addClass(type);

    $(".chat").perfectScrollbar("update");

    if (atBottom)
      $(".chat").animate(
        {
          scrollTop: chat.scrollHeight,
        },
        100
      );
  }

  return {
    init: init,
    update: update,
  };
};

var SoundManager = function () {
  function getTemplate(id) {
    return (
      '<audio class="hidden" src="sounds/' +
      id +
      '.mp3" id="sound_' +
      id +
      '"></audio>'
    );
  }

  function init() {
    for (let index = 1; index <= 5; index++) {
      $(getTemplate(index)).appendTo($(".sounds"));
    }
  }

  function play(id) {
    document.getElementById("sound_" + id).play();
  }

  return {
    init: init,
    play: play,
  };
};
