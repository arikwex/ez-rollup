# EZ Rollup

## What is this?
A quick build system for your client and server app using rollup and express. It's a quick scaffolding to start writing javascript instead of thinking about project configuration. Contains:
- Rollup.js with client code watching
- Express app with server code watching
- Websocket connection


## Setup
```
cd your-project/
npm init

// When this was written, I've been using this version of node.
nvm i 16.13.0
```
Review this code and then run it in the root level of your project.
This will only copy files in to your project and merge some required
```
node -e '
  const https = require("https");
  const fs = require("fs");
  const path = require("path");
  const BASE_URL = "https://raw.githubusercontent.com/arikwex/ez-rollup/main/prototype/";

  const get = (file) => {
    return new Promise((resolve, reject) => {
      https.get(BASE_URL + file, (res) => {
        let output = ""; res.setEncoding("utf8");
        res.on("data", (chunk) => { output += chunk; });
        res.on("end", () => { resolve(output); });
      });
    });
  }

  const mergePackage = async () => {
    const pkgNewContent = JSON.parse(await get("package.json"));
    const pkg = JSON.parse(fs.readFileSync("package.json"));
    Object.assign(pkg, pkgNewContent);
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
    console.log("(merged) package.json");
  }

  const copyFile = async (file) => {
    const fileContent = await get(file);
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    fs.writeFileSync(file, fileContent);
    console.log("(created) " + file);
  }

  const runner = async () => {
    await mergePackage();
    const files = [
      ".nvmrc",
      "rollup.config.js",
      "client/index.html",
      "client/scripts/main.js",
      "server/index.js",
      "server/logger.js",
      "server/app/router.js",
      "server/app/websocket.js",
    ];
    for (const file of files) {
      await copyFile(file);
    }
  }
  runner();
'
```
Finally run an `npm install` to make sure you have all the dependencies needed.


## Why this way?
This does not need to be a dependency in your project. This could potentially be configured via yeoman (or something similar), but I'd opted to make it as primitive and accessible as possible.
