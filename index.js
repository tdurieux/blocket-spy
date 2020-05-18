const parseSearchResults = require("./src/scripts/parse-search-results");
const spy = require("./src/index");

const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;


spy(5)

app.use(express.static("public"));

const adsDate = {}
app.get("/api/homes", function (req, res) {
  const filters = {
    student: false,
    shared: false,
    from: 0,
    to: 999999999,
    room: 0,
  };
  for (let q in req.query) {
    if (filters[q] !== undefined) {
      filters[q] = req.query[q];
      if (filters[q] == 'true') {
        filters[q] = true;
      } else if (filters[q] == 'false') {
        filters[q] = false;
      } else if (!isNaN(filters[q])) {
        filters[q] = parseInt(filters[q]);
      }
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
      if (adsDate[f] !== undefined) {
        if (adsDate[f] < lastWeek) {
          continue;
        }
      }
      const r = JSON.parse(fs.readFileSync("ads/" + f));
      adsDate[f] = new Date(r.publishedAt)
      if (adsDate[f] < lastWeek) {
        continue;
      }
      if (r.rent < filters.from || r.rent > filters.to) {
        continue;
      }
      if (r.roomCount < filters.room) {
        continue;
      }
      if (r.studentHome && !filters.student) {
        continue;
      }
      if (r.shared && !filters.shared) {
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
