const prompt = require("prompt-sync")();
const http = require("http");
const fs = require("fs");
const port = 3000;

const htmlPath = prompt("Please, enter path to HTML file:  ");
const dataPath = prompt("Please, enter path to data file:  ");
if (fs.existsSync(htmlPath) && fs.existsSync(dataPath)) {
  console.log("\nFiles exist:", htmlPath, dataPath);
} else {
  console.log("\nPlease, provide valid files");
  return;
}

const mergeValues = (values, content) => {
  for (let key in values) {
    content = content.replace("{{" + key + "}}", values[key]);
  }
  return content;
};

const view = (templateName, values, res) => {
  let fileContent = fs.readFileSync(templateName, "utf8");
  fileContent = mergeValues(values, fileContent);
  res.write(fileContent);
};

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(404);
      res.write(err);
    } else {
      const jsonData = JSON.parse(data);
      view(htmlPath, jsonData, res);
    }
    res.end();
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port number: ${port}`);
});
