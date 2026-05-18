(function (global) {
  "use strict";

  var DEFAULT_BASE_URL = "https://cataas.com";

  function RandomCatSDK(options) {
    options = options || {};

    this.baseUrl = normalizeBaseUrl(options.baseUrl || DEFAULT_BASE_URL);
    this.fetcher = options.fetcher || global.fetch;

    if (typeof this.fetcher !== "function") {
      throw new Error("RandomCatSDK requires fetch support.");
    }
  }

  RandomCatSDK.prototype.randomUrl = function (options) {
    options = options || {};

    return this.buildUrl(buildCatPath(options.tag), options);
  };

  RandomCatSDK.prototype.taggedUrl = function (tag, options) {
    options = Object.assign({}, options, { tag: tag });

    return this.randomUrl(options);
  };

  RandomCatSDK.prototype.gifUrl = function (options) {
    return this.buildUrl("/cat/gif", options);
  };

  RandomCatSDK.prototype.saysUrl = function (text, options) {
    options = options || {};

    return this.buildUrl("/cat/says/" + encodeURIComponent(requiredText(text)), options);
  };

  RandomCatSDK.prototype.taggedSaysUrl = function (tag, text, options) {
    var path = buildCatPath(tag) + "/says/" + encodeURIComponent(requiredText(text));

    return this.buildUrl(path, options);
  };

  RandomCatSDK.prototype.buildUrl = function (path, options) {
    options = options || {};

    var url = new URL(this.baseUrl + path);

    appendCommonQuery(url, options);

    return url.toString();
  };

  RandomCatSDK.prototype.random = function (options) {
    return this.request(this.randomUrl(options));
  };

  RandomCatSDK.prototype.tagged = function (tag, options) {
    return this.request(this.taggedUrl(tag, options));
  };

  RandomCatSDK.prototype.gif = function (options) {
    return this.request(this.gifUrl(options));
  };

  RandomCatSDK.prototype.says = function (text, options) {
    return this.request(this.saysUrl(text, options));
  };

  RandomCatSDK.prototype.taggedSays = function (tag, text, options) {
    return this.request(this.taggedSaysUrl(tag, text, options));
  };

  RandomCatSDK.prototype.randomJson = function (options) {
    options = Object.assign({}, options, { json: true });

    return this.fetcher(this.randomUrl(options)).then(handleJsonResponse);
  };

  RandomCatSDK.prototype.request = function (url) {
    return this.fetcher(url).then(function (response) {
      if (!response.ok) {
        throw new Error("RandomCatSDK request failed with status " + response.status);
      }

      return {
        url: response.url || url,
        contentType: response.headers.get("content-type"),
        response: response
      };
    });
  };

  RandomCatSDK.prototype.createImage = function (options) {
    var doc = getDocument();
    var image = doc.createElement("img");

    image.alt = options && options.alt ? options.alt : "Random cat";
    image.src = this.randomUrl(options);

    return image;
  };

  RandomCatSDK.prototype.render = function (target, options) {
    var doc = getDocument();
    var container = resolveTarget(doc, target);
    var image = this.createImage(options);

    container.appendChild(image);

    return image;
  };

  RandomCatSDK.prototype.mount = function (target, options) {
    var doc = getDocument();
    var sdk = this;
    var container = resolveTarget(doc, target || doc.body);
    var settings = Object.assign({ showUrl: true, controls: true }, options);
    var root = doc.createElement("div");
    var actions = doc.createElement("div");
    var output = doc.createElement("code");
    var image = doc.createElement("img");

    root.className = "random-cat-sdk";
    actions.className = "random-cat-sdk__actions";
    output.className = "random-cat-sdk__url";
    image.className = "random-cat-sdk__image";
    image.alt = settings.alt || "Random cat";

    applyDefaultStyles(root, actions, output, image);

    function show(url) {
      if (settings.showUrl) {
        output.textContent = url;
      }

      image.src = url;
      return url;
    }

    function addButton(label, onClick) {
      var button = doc.createElement("button");

      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", function () {
        show(onClick());
      });
      actions.appendChild(button);

      return button;
    }

    if (settings.controls) {
      addButton("Random", function () {
        return sdk.randomUrl(settings.randomOptions || settings.imageOptions);
      });
      addButton("Tagged", function () {
        return sdk.taggedUrl(settings.tag || "cute", settings.taggedOptions);
      });
      addButton("GIF", function () {
        return sdk.gifUrl(settings.gifOptions);
      });
      addButton("Says", function () {
        return sdk.saysUrl(settings.text || "hello", settings.saysOptions);
      });
      addButton("Tagged Says", function () {
        return sdk.taggedSaysUrl(settings.tag || "cute", settings.text || "sdk cat", settings.taggedSaysOptions);
      });
      root.appendChild(actions);
    }

    if (settings.showUrl) {
      root.appendChild(output);
    }

    root.appendChild(image);
    container.appendChild(root);
    show(this.randomUrl(settings.imageOptions));

    return {
      root: root,
      actions: actions,
      output: output,
      image: image,
      update: show,
      destroy: function () {
        if (root.parentNode) {
          root.parentNode.removeChild(root);
        }
      }
    };
  };

  function handleJsonResponse(response) {
    if (!response.ok) {
      throw new Error("RandomCatSDK request failed with status " + response.status);
    }

    return response.json();
  }

  function buildCatPath(tag) {
    if (!tag) {
      return "/cat";
    }

    return "/cat/" + encodeTags(tag);
  }

  function encodeTags(tag) {
    if (Array.isArray(tag)) {
      return tag.map(encodeURIComponent).join("/");
    }

    return String(tag)
      .split("/")
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/");
  }

  function requiredText(text) {
    if (text === undefined || text === null || text === "") {
      throw new Error("RandomCatSDK requires text.");
    }

    return String(text);
  }

  function normalizeBaseUrl(baseUrl) {
    return String(baseUrl).replace(/\/+$/, "");
  }

  function appendCommonQuery(url, options) {
    appendQuery(url, "json", options.json);
    appendQuery(url, "type", options.type);
    appendQuery(url, "filter", options.filter);
    appendQuery(url, "width", options.width);
    appendQuery(url, "height", options.height);
    appendQuery(url, "fit", options.fit);
    appendQuery(url, "position", options.position);
    appendQuery(url, "fontSize", options.fontSize);
    appendQuery(url, "fontColor", options.fontColor);
  }

  function appendQuery(url, key, value) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  function getDocument() {
    if (!global.document) {
      throw new Error("RandomCatSDK DOM methods require a browser document.");
    }

    return global.document;
  }

  function resolveTarget(doc, target) {
    if (!target) {
      return doc.body;
    }

    if (typeof target === "string") {
      var element = doc.querySelector(target);

      if (!element) {
        throw new Error("RandomCatSDK could not find target: " + target);
      }

      return element;
    }

    return target;
  }

  function applyDefaultStyles(root, actions, output, image) {
    root.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    root.style.maxWidth = "720px";

    actions.style.display = "flex";
    actions.style.flexWrap = "wrap";
    actions.style.gap = "8px";
    actions.style.marginBottom = "16px";

    output.style.display = "block";
    output.style.marginBottom = "16px";
    output.style.overflowWrap = "anywhere";

    image.style.display = "block";
    image.style.maxWidth = "100%";
    image.style.borderRadius = "8px";
  }

  global.RandomCatSDK = RandomCatSDK;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = RandomCatSDK;
  }
})(typeof window !== "undefined" ? window : globalThis);
