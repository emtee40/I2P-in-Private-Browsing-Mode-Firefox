function isProxyHost(requestDetails) {
  if (
    requestDetails.url.includes(
      control_host() + ":" + control_port() + "/jsonrpc"
    )
  )
    return false;
  const originUrl = requestDetails.originUrl;
  const isWindowOrHomeUrl =
    originUrl !== browser.runtime.getURL("window.html") &&
    originUrl !== browser.runtime.getURL("home.html");

  if (isWindowOrHomeUrl) {
    return false;
  }
  let rurl = new URL(requestDetails.url);
  let hostname = rurl.hostname;
  console.log("(proxy) proxyinfo proxy.i2p check", hostname);
  if (
    hostname === "proxy.i2p" ||
    hostname === "c6lilt4cr5x7jifxridpkesf2zgfwqfchtp6laihr4pdqomq25iq.b32.i2p"
  ) {
    console.log("(proxy) proxyinfo proxy.i2p positive", hostname);
    return true;
  }

  return false;
}

function isLocalHost(url) {
  console.log("(host) checking local host", url);
  const urlPath = url.toString().split("/")[2].split(":")[0];
  if (urlPath === "127.0.0.1" || urlPath === "localhost") {
    if (url.includes(":8084")) {
      return "blog";
    }
    if (url.includes(":7669")) {
      return "irc";
    }
    if (url.includes(":7695")) {
      return "tor";
    }
  }
  return false;
}

function isExtensionHost(url) {
  const extensionPrefix = browser.runtime
    .getURL("")
    .replace("moz-extension://", "")
    .replace("/", "");
  let isHost = false;

  if (url.originUrl !== undefined) {
    const originUrl = url.originUrl
      .replace("moz-extension://", "")
      .replace("/", "");
    isHost = originUrl.startsWith(extensionPrefix);
  } else if (url.documentUrl !== undefined) {
    const documentUrl = url.documentUrl
      .replace("moz-extension://", "")
      .replace("/", "");
    isHost = documentUrl.startsWith(extensionPrefix);
  }

  console.log(`(urlcheck) Is URL from extension host? ${isHost}`);

  return isHost;
}

function i2pHostName(url) {
  let hostname = "";
  const u = new URL(url);
  if (u.host.endsWith(".i2p")) {
    hostname = u.host;
  } else if (url.includes("=") && url.includes(".i2p")) {
    const lsit = url.split("=");
    for (const item of lsit) {
      const items = item.split(" % "); //"\%")
      for (const p of items) {
        if (p.includes(".i2p")) {
          hostname = p.replace("3D", 1);
          break;
        }
      }
      if (hostname !== "") {
        break;
      }
    }
  } else if (url.indexOf("://") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  return hostname;
}

function i2pHost(url) {
  if (isProxyHost(url)) {
    console.warn("(host) proxy.i2p", url.url);
    return false;
  }
  let hostname = i2pHostName(url.url);
  let postname = hostname.split(":")[0];
  if (postname.endsWith("proxy.i2p")) {
    return false;
  }
  return postname.endsWith(".i2p");
}

function notAnImage(url, path) {
  if (!url.includes(".png")) {
    return path;
  }
}

function getPathApplication(str, url) {
  if (!str) {
    return true;
  }

  const path = str.split("/")[0];

  if (path === "i2ptunnelmgr" || path === "i2ptunnel") {
    return "i2ptunnelmgr";
  }

  if (
    path === "i2psnark" ||
    path === "torrents" ||
    path.startsWith("transmission") ||
    path.startsWith("tracker") ||
    url.includes(":7662")
  ) {
    return "i2psnark";
  }

  if (path === "webmail" || path === "susimail") {
    return "webmail";
  }

  if (path.startsWith("MuWire")) {
    return notAnImage("muwire");
  }

  if (path.startsWith("i2pbote")) {
    return notAnImage("i2pbote");
  }

  if (
    path === "home" ||
    path === "console" ||
    path === "dns" ||
    path === "susidns" ||
    path.startsWith("susidns") ||
    path === "sitemap" ||
    path.startsWith("config")
  ) {
    return "routerconsole";
  }

  return true;
}

function isRouterHost(url) {
  let hostname = "";
  let path = "";
  console.log("(host) testing router host", url);

  if (url.indexOf("://") > -1) {
    hostname = url.split("/")[2];
    const protocol = url.substr(0, url.indexOf("://") + 3);
    path = url.replace(protocol + hostname + "/", "");
  } else if (identifyProtocolHandler(url)) {
    const newUrl = identifyProtocolHandler(url);
    console.log("(host) testing router host protocol handler identified");
    return isRouterHost(newUrl);
  } else {
    hostname = url.split("/")[0];
    path = url.replace(hostname + "/", "");
  }
  console.log("(host) testing router hostname", hostname, path);

  const localHosts = ["localhost", "127.0.0.1", control_host()];
  const controlPort = control_port();

  for (const host of localHosts) {
    let controlHost = host;
    console.log("(host) testing router hostname", hostname);
    if (hostname === `${controlHost}:${controlPort}` || isLocalHost(url)) {
      return getPathApplication(path, url);
    }
  }

  return false;
}

function identifyProtocolHandler(url) {
  //console.log("looking for handler-able requests")
  if (isRouterHost(url)) {
    if (url.includes(encodeURIComponent("ext+rc:"))) {
      return url.replace(encodeURIComponent("ext+rc:"), "");
    } else if (url.includes("ext+rc:")) {
      return url.replace("ext+rc:", "");
    }
  } else if (url.includes("ext+rc:")) {
    return url;
  }
  return false;
}
