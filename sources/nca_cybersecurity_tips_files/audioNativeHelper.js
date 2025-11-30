function replaceWidgetTagWithIframe() {
  const divs = document.querySelectorAll("#elevenlabs-audionative-widget");

  divs.forEach(function (div) {
    // Load properties from the 'div' tag
    const width = div.getAttribute("data-width");
    const height = div.getAttribute("data-height");
    const frameBorder = div.getAttribute("data-frameBorder");
    const scrolling = div.getAttribute("data-scrolling");
    const publicUserId = div.getAttribute("data-publicUserId");
    const small = div.hasAttribute("data-small")
      ? `&small=${div.getAttribute("data-small")}`
      : "";
    const textColor = div.hasAttribute("data-textColor")
      ? `&textColor=${div.getAttribute("data-textColor")}`
      : "";
    const backgroundColor = div.hasAttribute("data-backgroundColor")
      ? `&backgroundColor=${div.getAttribute("data-backgroundColor")}`
      : "";
    const projectId = div.hasAttribute("data-projectId")
      ? "&projectId=" + div.getAttribute("data-projectId")
      : "";
    const playerUrl = div.hasAttribute("data-playerUrl")
      ? div.getAttribute("data-playerUrl")
      : "https://elevenlabs.io/player";
    const qa = div.hasAttribute("data-qa")
      ? `&qa=${div.getAttribute("data-qa")}`
      : "";
    const src =
      playerUrl +
      `?publicUserId=${publicUserId}` +
      `${projectId}${textColor}${backgroundColor}${small}${qa}`;

    const iframeTag = document.createElement("iframe");
    iframeTag.id = "AudioNativeElevenLabsPlayer";
    iframeTag.title = "AudioNative ElevenLabs Player";
    iframeTag.width = width;
    iframeTag.height = height;
    iframeTag.style.maxHeight = height + "px";
    iframeTag.frameBorder = frameBorder;
    iframeTag.scrolling = scrolling;
    iframeTag.src = src;

    div.parentNode.replaceChild(iframeTag, div);
  });
}

window.addEventListener("load", function () {
  replaceWidgetTagWithIframe();
});

// Listen for messages from the iframe
window.addEventListener("message", function (event) {
  if (event.data === "audioNativeUrlRequest") {
    const frame = document.getElementById("AudioNativeElevenLabsPlayer");
    const faviconElements = document.querySelectorAll('link[rel="icon"]');
    if (frame && frame.contentWindow) {
      const message = {
        id: "audioNativeUrlResponse",
        url: window.location.href,
        favicons: Array.from(faviconElements).map(element => ({
          href: element.href,
          sizes: Array.from(element.sizes).join(" "),
        })),
      };
      frame.contentWindow.postMessage(message, "*");
    }
  }

  if (event.data === "audioNativeHideRequest") {
    const frame = document.getElementById("AudioNativeElevenLabsPlayer");
    frame.height = 0;
  }
});

window.addEventListener("beforeunload", function () {
  const frame = document.getElementById("AudioNativeElevenLabsPlayer");
  if (frame) {
    // trigger the unload event on the iframe
    frame.remove();
  }
});

// Calling in case script was loaded after window.load event - useEffect in React or similar
replaceWidgetTagWithIframe();
