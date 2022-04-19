insert into "images" ("imageUrl")
values ('/images/myaquarium.jpg'),
('/images/betta-fish.jpg'),
('/images/myaquarium2.jpg'),
('/images/angel-fish.jpg');

insert into "tanks" ("name", "imageId", "size", "dateAdded")
values ('Bikini Bottom', 1, 30, '2020-01-10 10:30:20.15 -07:00'),
('Chum Bucket', 3, 50, '2020-01-14 10:30:20.15 -07:00');

insert into "conditions" ("tankId", "pH", "temperature", "ammonia", "nitrite", "nitrate", "dateLogged")
values (1, 7.0, 75, 2.5, 2.5, 20, '2017-08-10 10:30:20.15 -07:00'),
(1, 6.5, 78, 1.5, 1.5, 15, '2018-09-10 10:30:20.15 -07:00');

insert into "inhabitants" ("tankId", "name", "species", "imageId", "dateAdded")
values (1, 'Betsy', 'betta fish', 2, '2017-08-10 10:30:20.15 -07:00'),
(2, 'Earl', 'angel fish', 4, '2021-10-20 10:30:20.15 -03:00');
