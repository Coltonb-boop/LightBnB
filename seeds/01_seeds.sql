INSERT INTO users (name, email, password) VALUES ('Me', 'me@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Chicken', 'poultry@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Cow', 'moo@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'bird house', 'description', 'thumbnail_photo_url', 'cover_photo_url', 0, 1, 1, 8, 'Canada', 'Elm Street', 'Calgary', 'Alberta', 't9c8x8'),
(2, 'dog house', 'description', 'thumbnail_photo_url', 'cover_photo_url', 1, 4, 1, 2, 'Canada', 'Bark Ave', 'Calgary', 'Alberta', 't9c8x7'),
(3, 'field house', 'description', 'thumbnail_photo_url', 'cover_photo_url', 1, 1, 3, 5, 'Canada', 'Grass Blvd', 'Calgary', 'Alberta', 't9c8x1');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES (NOW(), NOW(), 1, 2),
(NOW(), NOW(), 3, 3),
(NOW(), NOW(), 2, 1);

INSERT INTO property_reviews (property_id, guest_id, reservation_id, rating, message)
VALUES (1, 2, 1, 5, 'message'),
(3, 3, 2, 3, 'message'),
(2, 1, 3, 5, 'message');