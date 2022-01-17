# EZ Rollup

Get started
```
cd your-project/
npm init
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
  }

  const copyFile = async (file) => {
    const fileContent = await get(file);
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    fs.writeFileSync(file, fileContent);
  }

  const runner = async () => {
    const promises = [];
    promises.push(mergePackage());
    [
      "client/index.html",
      "client/scripts/main.js",
      "server/index.js",
    ].forEach((file) => { promises.push(copyFile(file)); });
    await Promise.all(promises);
  }
  runner();
'
```
