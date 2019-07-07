$(function() {
  const h = $(window).height();
  const w = $(window).width();
  $(".result-page").css("display", "none");
  $(".create-page").css("display", "none");
  $("#loader-bg ,#loader")
    .height(h)
    .width(w)
    .css("display", "block");
});
window.onload = () => {
  $("#loader-bg")
    .delay(900)
    .fadeOut(800);
  $("#loader")
    .delay(600)
    .fadeOut(300);
  $(".result-page").css("display", "flex");
  $(".create-page").css("display", "block");

  if (isPlayed()) {
    renderTanzaku(getCookie("content"), getCookie("name"));
    renderPrize(getCookie("mentor"), getCookie("prize"));
  }

  $(".create-button").click(() => {
    const nickname = $(".textbox-name").val();
    const content = $(".textbox-content").val();
    if (content.length > 40) {
      $(".error-label-content").css("display", "block");
      return;
    }
    if (nickname.length > 20) {
      $(".error-label-nickname").css("display", "block");
      return;
    }
    getPrize().done(data => {
      renderPrize(data["mentor"], data["prize"]);
      registerResult(nickname, content, data["mentor"], data["prize"]);
      postResult(nickname, content, data["mentor"], data["prize"]);
    });
    renderTanzaku(content, nickname);
  });
};

const renderTanzaku = (content, nickname) => {
  $(".result-page").css("z-index", "2");
  const tanzaku = $(".tanzaku");
  const tanzakuContent = $(".tanzaku-content");
  const tanzakuName = $(".tanzaku-name");
  const tanzakuHeight = tanzaku.height();
  tanzaku.css("width", `${tanzakuHeight * 0.4981}px`);
  const tanzakuWidth = tanzaku.width();
  tanzakuContent.css("top", `${tanzakuHeight * 0.2404}px`);
  tanzakuContent.css("right", `${tanzakuWidth * 0.2077}px`);
  tanzakuContent.css("height", `${tanzakuHeight * 0.6977}px`);
  tanzakuName.css("left", `${tanzakuWidth * 0.167}px`);
  tanzakuName.css("bottom", `${tanzakuHeight * 0.0659 + content.length * 6}px`);
  if (content.length > 32) {
    tanzakuContent.css("font-size", "1.8em");
    tanzakuContent.css("right", `${tanzakuWidth * 0.1977}px`);
    tanzakuContent.css("line-height", "1.6em");
  }
  console.log(nickname.length);
  tanzakuContent.text(content);
  tanzakuName.text(nickname);
};

const renderPrize = (name, prize) => {
  $(".from-label").text(name);
  $(".award-label").text(prize);
};

const getPrize = () => {
  return $.ajax({
    url: "/api/prize",
    type: "GET"
  });
};

const postResult = (name, content, mentor, prize) => {
  $.ajax({
    url: "/post/negai",
    type: "POST",
    data: { name: name, content: content, mentor: mentor, prize: prize }
  });
};

const isPlayed = () => {
  if (getCookie("name")) {
    return true;
  }
  if (getCookie("content")) {
    return true;
  }
  if (getCookie("prize")) {
    return true;
  }
  return false;
};

const registerResult = (name, content, mentor, prize) => {
  setCookie("name", name);
  setCookie("content", content);
  setCookie("mentor", mentor);
  setCookie("prize", prize);
};

const setCookie = (key, value) => {
  document.cookie = `${key}=${value}`;
};

const getCookie = name => {
  let result = null;

  const cookieName = name + "=";
  const allcookies = document.cookie;

  const position = allcookies.indexOf(cookieName);
  if (position != -1) {
    let startIndex = position + cookieName.length;

    let endIndex = allcookies.indexOf(";", startIndex);
    if (endIndex == -1) {
      endIndex = allcookies.length;
    }

    result = decodeURIComponent(allcookies.substring(startIndex, endIndex));
  }

  return result;
};

const screenshot = selector => {
  console.log(selector);
  var element = $(selector).prevObject;
  console.log(element);
  html2canvas(element, {
    onrendered: function(canvas) {
      var imgData = canvas.toDataURL();
      $("#screen_image")[0].src = imgData;
      $("#download")[0].href = imgData;
      $("#download")[0].innerHTML = "Download";
    }
  });
};
