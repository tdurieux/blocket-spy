const parseSearchResults = require("./src/scripts/parse-search-results");
const spy = require("./src/index");

const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;


spy(5)

app.use(express.static("public"));
app.get("/api/ad/:id", async function (req, res) {
  const results = await parseSearchResults({
    url:
      "https://bostad.blocket.se/rent/apartment/radsvagen-huddinge/" +
      req.params.id,
  });
  res.json(results);
});

app.get("/api/ads", function (req, res) {
  const filters = {
    student: false,
    shard: false,
    from: 0,
    to: 999999999,
    room: 0,
  };
  for (let q in req.query) {
    if (filters[q] !== undefined) {
      filters[q] = req.query[q];
    }
  }
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  fs.readdir("ads", (err, files) => {
    const output = [];
    for (let f of files) {
      if (f.indexOf(".json") == -1) {
        continue;
      }
      const r = JSON.parse(fs.readFileSync("ads/" + f));
      if (new Date(r.updatedAt) < lastWeek) {
        continue;
      }
      if (r.rent < filters.from) {
        continue;
      }
      if (r.rent > filters.to) {
        continue;
      }
      if (r.studentHome && !filters.student) {
        continue;
      }
      if (r.shared && !filters.shared) {
        continue;
      }
      if (r.roomCount < filters.room) {
        continue;
      }
      output.push(r);
    }

    output.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    res.json(output);
  });
});
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
