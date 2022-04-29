require('dotenv/config');
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
  const fileUrl = req.file.location;
  const size = Number(req.body.size);
  if (!Number.isInteger(size) || size < 0) {
    throw new ClientError(400, 'size must be an integer');
  }
  if (!name || !size) {
    throw new ClientError(400, 'image, name, and size are required fields');
  }
  const sql1 = `
    insert into "images" ("imageUrl")
    values ($1)
    returning *;
  `;
  const params1 = [fileUrl];
  db.query(sql1, params1)
    .then(result => {
      const [newImage] = result.rows;
      const imageId = Number(newImage.imageId);
      const sql2 = `
        insert into "tanks" ("name", "imageId", "size")
        values ($1, $2, $3)
        returning *
      `;
      const params2 = [name, imageId, size];
      db.query(sql2, params2)
        .then(result => {
          const [newTank] = result.rows;
          res.status(201).json({ newImage, newTank });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/aquariums', (req, res, next) => {
  const sql = `
    select "tanks"."tankId", "tanks"."name" as "tankName", "tanks"."dateAdded", "images"."imageId",
    "images"."imageUrl", COALESCE("inhabitants"."population", 0) as "population", "conditions"."dateLogged",
    "conditions"."pH", "conditions"."temperature", "conditions"."ammonia", "conditions"."nitrite", "conditions"."nitrate"
    from "images"
    join "tanks" using ("imageId")
    left join (
      select "tankId", count(*) as "population"
      from "inhabitants"
      group by "tankId"
    ) "inhabitants"  on "tanks"."tankId" = "inhabitants"."tankId"
    left join (
      select "conditions"."conditionsId", "conditions"."tankId", "conditions"."pH", "conditions"."temperature", "conditions"."ammonia",
        "conditions"."nitrite", "conditions"."nitrate", "conditions"."dateLogged"
      from "conditions"
      join (
        select "tankId", MAX("dateLogged") as "dateLogged"
        from "conditions"
        group by "tankId") as "recentConditions"
        on "conditions"."tankId"="recentConditions"."tankId" AND
        "conditions"."dateLogged"="recentConditions"."dateLogged"
    ) "conditions" on "tanks"."tankId" = "conditions"."tankId"
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
  const fileUrl = req.file.location;
  if (!tankId || !name || !species) {
    throw new ClientError(400, 'image, tankId, name, and species are required fields');
  }
  const sql1 = `
    insert into "images" ("imageUrl")
    values ($1)
    returning *;
  `;
  const params1 = [fileUrl];
  db.query(sql1, params1)
    .then(result => {
      const [newImage] = result.rows;
      const imageId = Number(newImage.imageId);
      const sql2 = `
        insert into "inhabitants" ("tankId", "name", "species", "imageId")
        values ($1, $2, $3, $4)
        returning *;
      `;
      const params2 = [tankId, name, species, imageId];
      db.query(sql2, params2)
        .then(result => {
          const [newInhabitant] = result.rows;
          res.status(201).json({ newImage, newInhabitant });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/aquariums/:tankId', (req, res, next) => {
  const tankId = Number(req.params.tankId);
  if (!tankId) {
    throw new ClientError(400, 'tankId must be a positive integer');
  }
  const sql = `
    select "tanks"."tankId", "tanks"."name" as "tankName", "tanks"."dateAdded", "images"."imageId",
      "images"."imageUrl", COALESCE("inhabitants"."population", 0) as "population", "conditions"."dateLogged",
      "conditions"."pH", "conditions"."temperature", "conditions"."ammonia", "conditions"."nitrite", "conditions"."nitrate"
    from "images"
    join "tanks" using("imageId")
    left join(
        select "tankId", count(*) as "population"
        from "inhabitants"
        group by "tankId"
        ) "inhabitants"  on "tanks"."tankId" = "inhabitants"."tankId"
    left join(
        select "conditions"."conditionsId", "conditions"."tankId", "conditions"."pH", "conditions"."temperature", "conditions"."ammonia",
        "conditions"."nitrite", "conditions"."nitrate", "conditions"."dateLogged"
        from "conditions"
        join(
            select "tankId", MAX("dateLogged") as "dateLogged"
            from "conditions"
            group by "tankId") as "recentConditions"
            on "conditions"."tankId" = "recentConditions"."tankId" AND
            "conditions"."dateLogged" = "recentConditions"."dateLogged"
        ) "conditions" on "tanks"."tankId" = "conditions"."tankId"
    where "tanks"."tankId" = $1;
  `;
  const params = [tankId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(400, `cannot find tank with tankId ${tankId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/inhabitants/:tankId', (req, res, next) => {
  const tankId = Number(req.params.tankId);
  if (!tankId) {
    throw new ClientError(400, 'tankId must be a positive integer');
  }
  const sql = `
    select *
    from "inhabitants"
    join "images" using ("imageId")
    where "inhabitants"."tankId" = $1;
  `;
  const params = [tankId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(400, `There are no inhabitants in the tankId ${tankId}`);
      }
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.delete('/api/inhabitants/:inhabitantId', (req, res, next) => {
  const inhabitantId = Number(req.params.inhabitantId);
  if (!inhabitantId) {
    throw new ClientError(400, 'inhabitantId must be a positive integer');
  }
  const sql1 = `
    delete from "inhabitants"
    where "inhabitantId" = $1
    returning *;
  `;
  const params1 = [inhabitantId];
  db.query(sql1, params1)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(400, `There is no record of the inhabitant with the inhabitantId ${inhabitantId}`);
      }
      const [removedInhabitant] = result.rows;
      const imageId = Number(removedInhabitant.imageId);
      const sql2 = `
        delete from "images"
        where "imageId" = $1
        returning *;
      `;
      const params2 = [imageId];
      db.query(sql2, params2)
        .then(result => {
          if (!result.rows) {
            throw new ClientError(400, `There is no record of the image with the imageId ${imageId}`);
          }
          res.sendStatus(204);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/conditions/:tankId', (req, res, next) => {
  const tankId = Number(req.params.tankId);
  if (!tankId) {
    throw new ClientError(400, 'tankId must be a positive integer');
  }
  const sql = `
    select *
    from "conditions"
    where "conditions"."tankId" = $1
    order by "conditions"."dateLogged" desc;
  `;
  const params = [tankId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        throw new ClientError(400, `There are no conditions logged for the tankId ${tankId}`);
      }
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/conditions', (req, res, next) => {
  const { pH, temperature, ammonia, nitrite, nitrate, tankId } = req.body;
  if (!pH || !temperature || !ammonia || !nitrite || !nitrate || !tankId) {
    throw new ClientError(400, 'pH, temperature, ammonia, nitrite, nitrate, and tankId are required fields');
  }
  const sql = `
    insert into "conditions" ("pH", "temperature", "ammonia", "nitrite", "nitrate", "tankId")
    values ($1, $2, $3, $4, $5, $6)
    returning *;
  `;
  const params = [pH, temperature, ammonia, nitrite, nitrate, tankId];
  db.query(sql, params)
    .then(result => {
      const [newConditions] = result.rows;
      res.status(201).json(newConditions);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
