const translate = require('google-translate-open-api').default;

const spy = require("./src/index");

const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;


spy(5)

app.use(express.static("public"));

const adsDate = {}
app.get("/api/home/:id/translate", async function (req, res) {
  const r = JSON.parse(fs.readFileSync("ads/" + req.params.id + '.json'));
  if (r.description_en) {
    return res.json(r);
  }
  const result = await translate(r.description, { to: 'en' });
  r.description_en = result.data[0];
  fs.writeFileSync("ads/" + req.params.id + '.json', JSON.stringify(r));
  return res.json(r);
})
app.get("/api/homes", function (req, res) {
  const filters = {
    student: false,
    shared: false,
    from: 0,
    to: 999999999,
    room: 0,
    moveIn: null,
    moveOut: null
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
  if (filters.moveIn) {
    filters.moveIn = new Date(filters.moveIn)
    filters.moveIn = Math.max(new Date(), filters.moveIn);
  }
  if (filters.moveOut) {
    filters.moveOut = new Date(filters.moveOut)
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
      if (filters.moveIn) {
        let date = null;
        if (r.duration.start.optimal) {
          date = new Date(r.duration.start.optimal)
        } else if (r.duration.start.asap) {
          date = new Date()
        }
        if (date != null && filters.moveIn < date) {
          continue;
        }
      }
      if (filters.moveOut) {
        let date = null;
        if (r.duration.end.optimal) {
          date = new Date(r.duration.end.optimal)
        } else if (r.duration.end.asap) {
          date = new Date()
        }
        if (date != null && filters.moveOut > date) {
          continue;
        }
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
