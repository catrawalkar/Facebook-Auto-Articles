require("dotenv").config();
const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");
const request = require("request");

const parseSite = async (site) => {
  let feed = await parser.parseURL(site.rssfeed);

  fs.readFile(site.log, "utf8", function (err, file) {
    if (err) return console.log(err);

    feed.items.forEach((item) => {
      if (!file.includes(item.link)) {
        const data = item.title + ":" + item.link + "\n";
        fs.appendFile(site.log, data, function (err) {
          if (err) return console.log(err);
        });

        request.post(
          `https://graph.facebook.com/v8.0/2039216499697073/feed?link=${item.link}&message=${item.description}&access_token=${process.env.TOKEN}`
        );
        return;
      }
      console.log("already there");
    });
  });
};

const sites = [
  {
    rssfeed: "https://www.newsbharati.com/rssfeed.rss",
    title: "newsbharati",
    log: "log.newsbharati.txt",
  },
];

sites.map((site) => {
  parseSite(site);
});
