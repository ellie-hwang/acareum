insert into "images" ("imageUrl")
values ('/images/myaquarium.jpg'),
('/images/betta-fish.jpg'),
('/images/myaquarium2.jpg');

insert into "tanks" ("name", "imageId", "size", "dateAdded")
values ('Bikini Bottom', 1, 30, '2020-01-10 10:30:20.15 -07:00'),
('Chum Bucket', 3, 50, '2020-01-14 10:30:20.15 -07:00');

insert into "conditions" ("tankId", "pH", "temperature", "ammonia", "nitrite", "nitrate", "dateLogged")
values (1, 7.0, 75, 2.5, 2.5, 20, '2017-08-10 10:30:20.15 -07:00');

insert into "inhabitants" ("tankId", "name", "status", "imageId", "dateAdded")
values (1, 'Betsy', 'sick', 2, '2017-08-10 10:30:20.15 -07:00');
