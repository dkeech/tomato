/* @categories.js
 *
 * Routes for /categories
 *
 */
const router = require('express').Router();
const {
  getDB
} = require('../lib/db');
const TomatoError = require("../lib/tomato-error");

const {
  genAuthToken,
  requireAuth
} = require('../lib/auth');


/*
 * Get all Categories for a user
 *
 * @TODO enable authentication with requireAuth pre-route
 * router.get('/', requireAuth, (req, res, next) => {
 */
router.get('/', (req, res, next) => {
  const db = getDB();

  // Fetch ID from JWT token
  let user_id = 1;
  try {

    console.log(" == getCategories: ", user_id);

    let sql = 'SELECT * from categories WHERE user_id = ?';

    db.query(sql, user_id, function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        // Check for result not found

        // if results
        console.log('results', results);
        res.status(200).send(results);
      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }

});


/*
 * Create a new Category
 *
 * @TODO add field validation
 * @TODO enable authentication with requireAuth pre-route
 * router.post('/', requireAuth, (req, res, next) => {
 */
router.post('/', (req, res, next) => {
  const db = getDB();
  //  Validate required fields here

  // Fetch ID from JWT token
  let user_id = 1;

  if (true) {
    try {

      console.log(" == insertCategory: ", req.body);

      let sql = 'INSERT INTO categories (user_id, category_name) VALUES (?, ?)';

      let cat = [
        user_id,
        req.body.category_name
      ];


      console.log("== cat", cat);
      db.query(sql, cat, function(err, results) {
        if (err) {
          // Pass any database errors to the error route
          next(new TomatoError("Database error: " + err.message, 500));
        } else {
          console.log("== results ", results);
          res.status(201).send({
            id: results.insertId
          });
        }
      });

    } catch (err) {
      console.log('== route err catch');
      // Throw for all errors including DB issues
      next(new TomatoError("Internal error adding category: " + err.message, 500));
    }

  } else {
    next(new TomatoError("Request is not valid", 400));
  }
});


/*
 * Update a Category
 *
 * @TODO add field validation
 * @TODO enable authentication with requireAuth pre-route
 * router.post('/', requireAuth, (req, res, next) => {
 *
 */
router.patch('/:id', (req, res, next) => {
  const db = getDB();
  // Fetch User Id from JWT token
  user_id = 1;

  // Check here if field set matches
  try {

    console.log(" == updateCategory: ", req.body);

    let sql = 'UPDATE categories SET ? WHERE category_id = ? AND user_id = ?';

    db.query(sql, [req.body, req.params.id, user_id], function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
          console.log('results', results );
          res.status(200).send({});

      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }

});



/*
 * Delete a Category
 *
 * @TODO enable authentication with requireAuth pre-route
 * router.delete('/:id', requireAuth, (req, res, next) => {
 */
router.delete('/:id', async (req, res, next) => {
  const db = getDB();
  // Fetch user ID from JWT token
  user_id = 1;

  try {

    console.log(" == deleteCategory: ", req.params.id);

    // ON CASCADE will delete tasks when categories are deleted
    let sql = 'DELETE from categories WHERE category_id = ? AND user_id = ?;';

    db.query(sql, [req.params.id, user_id], function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        res.status(200).send({});
      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }
});

module.exports = router;
