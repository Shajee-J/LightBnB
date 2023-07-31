CREATE TABLE users (
  id INTEGER PRIMARY KEY NOT NULL, 
  name VARCHAR(255), 
  email VARCHAR(255)
  password VARCHAR(255)
); 

CREATE TABLE propeties (
  id INTEGER PRIMARY KEY NOT NULL,
  owner_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255),
  description TEXT, 
  thumbnail_photo_url VARCHAR(255),
  cost_per_night INTEGER
  parking_spaces INTEGER,
  number_of_bathrooms INTEGER,
  number_of_bedrooms INTEGER, 
  country VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(255),
  province VARCHAR(255),
  post_code VARCHAR(255),
  active BOOLEAN
); 

CREATE TABLE reservations (
  id INTEGER PRIMARY KEY NOT NULL, 
  start_date DATE, 
  end_date DATE, 
  property_id INT REFERENCES propeties(id) ON DELETE CASCADE NOT NULL,
  guest_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE property_reviews (
  id INTEGER PRIMARY KEY NOT NULL, 
  guest_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
  property_id INT REFERENCES propeties(id) ON DELETE CASCADE NOT NULL,
  reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  rating SMALLINT,
  message TEXT 
); 


CREATE TABLE users (
  id INTEGER PRIMARY KEY NOT NULL, 
  name VARCHAR(255), 
  email VARCHAR(255)
  password VARCHAR(255)
); 

CREATE TABLE propeties (
  id INTEGER PRIMARY KEY NOT NULL,
  owner_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255),
  description TEXT, 
  thumbnail_photo_url VARCHAR(255),
  cost_per_night INTEGER
  parking_spaces INTEGER,
  number_of_bathrooms INTEGER,
  number_of_bedrooms INTEGER, 
  country VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(255),
  province VARCHAR(255),
  post_code VARCHAR(255),
  active BOOLEAN
); 

CREATE TABLE reservations (
  id INTEGER PRIMARY KEY NOT NULL, 
  start_date DATE, 
  end_date DATE, 
  property_id INT REFERENCES propeties(id) ON DELETE CASCADE NOT NULL,
  guest_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE property_reviews (
  id INTEGER PRIMARY KEY NOT NULL, 
  guest_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
  property_id INT REFERENCES propeties(id) ON DELETE CASCADE NOT NULL,
  reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  rating SMALLINT,
  message TEXT 
); 

