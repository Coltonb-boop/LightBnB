const properties = require('./json/properties.json');
const users = require('./json/users.json');
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
const getUserWithEmail = function(email) {
  
  const values = [email];
  const queryString = `
  SELECT * 
  FROM users 
  WHERE email = $1;
  `;
  
  return pool.query(queryString, values)
  .then(result => {
    if (result.rows.length > 0)
    {
      return result.rows[0];
    }
    return null;
  })
  .catch(err => console.log(err.message));
  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const values = [id];
  const queryString = `
  SELECT * 
  FROM users 
  WHERE id = $1;
  `;
  
  return pool.query(queryString, values)
  .then(result => {
    if (result.rows.length > 0)
    {
      return result.rows[0];
    }
    return null;
  })
  .catch(err => console.log(err.message));
  
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  const {name, email, password} = user;

  const values = [name, email, password];
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  
  return pool.query(queryString, values)
  .then(result => {
    return result.rows;
  })
  .catch(err => console.log(err.message));
  
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const values = [guest_id, limit];
  const queryString = `
    SELECT reservations.*, properties.title, properties.cost_per_night, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2`;
  
  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(err => console.log(err.message));
  
  
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options = {}, limit = 10) {
  
  const queryParams = [];

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += queryParams.length > 1 ? 
    `AND owner_id = $${queryParams.length} ` : 
    `WHERE owner_id = $${queryParams.length} `
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += queryParams.length > 1 ? 
    `AND cost_per_night/100 > $${queryParams.length} ` : 
    `WHERE cost_per_night/100 = $${queryParams.length} `
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += queryParams.length > 1 ? 
    `AND cost_per_night/100 < $${queryParams.length} ` : 
    `WHERE cost_per_night/100 = $${queryParams.length} `
  }
  
  queryString += `
  GROUP BY properties.id
  `;
  
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
  .then(result => result.rows)
  .catch(err => console.log(err.message));
  
}
exports.getAllProperties = getAllProperties;
getAllProperties();

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  
  const {
    owner_id, 
    title, 
    description, 
    thumbnail_photo_url, 
    cover_photo_url, 
    cost_per_night, 
    street, 
    city, 
    province, 
    post_code, 
    country, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms
  } = property;

  values = [
    owner_id, 
    title, 
    description, 
    thumbnail_photo_url, 
    cover_photo_url, 
    cost_per_night, 
    street, 
    city, 
    province, 
    post_code, 
    country, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms
  ];

  console.log(values);

  let queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  
  return pool.query(queryString, values)
    .then(res => res.rows[0])
    .catch(err => console.log(err.message));
  
}
exports.addProperty = addProperty;
