const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((result) => {
      return result.rows.length ? result.rows[0] : null;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query('SELECT * FROM users WHERE id = $1', [id])
    .then((result) => {
      return result.rows.length ? result.rows[0] : null;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  const { name, email, password } = user;
  return pool
    .query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [name, email, password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error(err.message);
      return null;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      return result.rows
    })
    .catch((err) => {
      console.error(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryString += `AND (cost_per_night / 100) >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    queryString += `AND (cost_per_night / 100) <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `AND rating >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams).then((res) => res.rows);
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

// deconstructed method:

const addProperty = (property) => {
  const queryParams = [];
  let queryString = `
  INSERT INTO properties (
    title, 
    description, 
    owner_id, 
    cover_photo_url, 
    thumbnail_photo_url, 
    cost_per_night, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms, 
    active, 
    province, 
    city, 
    country, 
    street, 
    post_code)

    VALUES (
  `
  queryParams.push(property.title);
  queryString += `$${queryParams.length},`;



  queryParams.push(property.description);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.owner_id);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.cover_photo_url);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.thumbnail_photo_url);
  queryString += `$${queryParams.length}, `;


  queryParams.push(parseFloat(property.cost_per_night));
  queryString += `$${queryParams.length}, `;


  queryParams.push(property.parking_spaces);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.number_of_bathrooms);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.number_of_bedrooms);
  queryString += `$${queryParams.length}, `;


  queryParams.push(true);
  queryString += `$${queryParams.length}, `;


  queryParams.push(property.province);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.city);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.country);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.street);
  queryString += `$${queryParams.length}, `;



  queryParams.push(property.post_code);
  queryString += `$${queryParams.length})`


  queryString += `RETURNING *;`;

  return pool.query(queryString, queryParams).then((res) => res.rows);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};





// Alternate method, in which the query string and the passed values are seperated:

// const addProperty = function (property) {
//   const queryParams = [];
//   let queryString = `
//     INSERT INTO properties (
//       owner_id,
//       title,
//       description,
//       thumbnail_photo_url,
//       cover_photo_url,
//       cost_per_night,
//       parking_spaces,
//       number_of_bathrooms,
//       number_of_bedrooms,
//       active,
//       province,
//       city,
//       country,
//       street,
//       post_code
//     )
//     VALUES (
//       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
//     )
//     RETURNING *;
//   `;

//   queryParams.push(
//     property.owner_id,
//     property.title,
//     property.description,
//     property.thumbnail_photo_url,
//     property.cover_photo_url,
//     parseFloat(property.cost_per_night),
//     property.parking_spaces,
//     property.number_of_bathrooms,
//     property.number_of_bedrooms,
//     true, // Make sure 'active' property is included
//     property.province,
//     property.city,
//     property.country,
//     property.street,
//     property.post_code
//   );

//   return pool.query(queryString, queryParams).then((res) => res.rows[0]);
// };