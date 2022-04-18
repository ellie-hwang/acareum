require('dotenv/config');
const path = require('path');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const uploadsMiddleware = require('./uploads-middleware');

const app = express();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.post('/api/aquariums', uploadsMiddleware, (req, res, next) => {
  const { name } = req.body;
  const url = path.join('/images', req.file.filename);
  const size = Number(req.body.size);
  if (!Number.isInteger(size) || size < 0) {
    throw new ClientError(400, 'size must be an integer');
  }
  if (!url || !name || !size) {
    throw new ClientError(400, 'name, and size are required fields');
  }
  const sql1 = `
    insert into "images" ("imageUrl")
    values ($1)
    returning *;
  `;
  const params1 = [url];
  db.query(sql1, params1)
    .then(result => {
      const [newImage] = result.rows; // returns a json obj { "imageId":"someNumber" }
      // res.status(201).json(newImage);
      const imageId = Number(newImage.imageId);
      const sql2 = `
        insert into "tanks" ("name", "imageId", "size")
        values ($1, $2, $3)
        returning *
      `;
      const params2 = [name, imageId, size];
      db.query(sql2, params2)
        .then(result => {
          const [newTank] = result.rows; // return a json obj { tankId, name, imageId, size }
          res.status(201).json({ newImage, newTank });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/aquariums', (req, res, next) => {
  const sql = `
    select "tanks"."tankId", "tanks"."name" as "tankName", "tanks"."dateAdded", "images"."imageId",
    "images"."imageUrl", COALESCE("inhabitants"."population", 0) as "population", "conditions"."pH",
    "conditions"."temperature", "conditions"."ammonia", "conditions"."nitrite", "conditions"."nitrate"
    from "images"
    join "tanks" using ("imageId")
    left join (
      select "tankId", count(*) as "population"
      from "inhabitants"
      group by "tankId"
    ) "inhabitants"  on "tanks"."tankId" = "inhabitants"."tankId"
    left join "conditions" on "tanks"."tankId" = "conditions"."tankId"
    order by "tanks"."dateAdded" desc;
  `;
  db.query(sql)
    .then(result => {
      const tanks = result.rows;
      res.status(201).json(tanks);
    })
    .catch(err => next(err));
});

app.post('/api/inhabitants', uploadsMiddleware, (req, res, next) => {
  const { name, species, tankId } = req.body;
  const url = path.join('/images', req.file.filename);
  if (!url || !name || !species) {
    throw new ClientError(400, 'url, name, and species are required fields');
  }
  const sql1 = `
    insert into "images" ("imageUrl")
    values ($1)
    returning *;
  `;
  const params1 = [url];
  db.query(sql1, params1)
    .then(result => {
      const [newImage] = result.rows; // returns a json obj { "imageId":"someNumber" }
      const imageId = Number(newImage.imageId);
      const sql2 = `
        insert into "inhabitants" ("tankId", "name", "species", "imageId")
        values ($1, $2, $3, $4)
        returning *
      `;
      const params2 = [tankId, name, species, imageId];
      db.query(sql2, params2)
        .then(result => {
          const [newInhabitant] = result.rows; // return a json obj { inhabitantId, tankId, name, species, dateAdded, imageId}
          res.status(201).json({ newImage, newInhabitant });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
