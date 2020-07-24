/* @users.js
 *
 * Routes for /api/users
 *
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs')
const {
  getDB
} = require('../lib/db');
const TomatoError = require("../lib/tomato-error");

const {
  genAuthToken,
  requireAuth
} = require('../lib/auth');

/*
 * Create a new User account
 *
 * @TODO add field validation
 */
router.post('/', async (req, res, next) => {
  const db = getDB();
  //  Validate required fields here
  if (true) {
    try {

      console.log(" == insertNewUser: ", req.body);

      let sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const passwordHash = await bcrypt.hash(req.body.password, 8);
      const user = [
        req.body.username,
        req.body.email,
        passwordHash
      ];

      console.log("== user", user);
      db.query(sql, user, function(err, results) {
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
      next(new TomatoError("Internal error adding user: " + err.message, 500));
    }

  } else {
    next(new TomatoError("Request is not valid", 400));
  }
});

/*
 * Get the details of a User
 *
 * @TODO enable authentication with requireAuth pre-route
 * router.get('/:id', requireAuth, (req, res, next) => {
 */
router.get('/:id', (req, res, next) => {
  const db = getDB();

  // Check here if ID of user matches ID of JWT token

  try {

    console.log(" == getUserDetails: ", req.params.id);

    let sql = 'SELECT user_id, username, email from users WHERE user_id = ?';

    db.query(sql, [req.params.id], function(err, results) {
      if (err) {
        // Pass any database errors to the error route
        next(new TomatoError("Database error: " + err.message, 500));
      } else {
        // Check for result not found

        // if results
        console.log('results', results);
        res.status(200).send(results[0]);
      }
    });

  } catch (err) {
    console.log('== route err catch');
    // Throw for all errors including DB issues
    next(new TomatoError("Internal error adding user: " + err.message, 500));
  }


});


/*
 * Update the details of a User
 *
 * @TODO verify field set
 * @TODO enable authentication with requireAuth pre-route
 * router.patch('/:id', requireAuth, (req, res, next) => {
 */
router.patch('/:id', async (req, res, next) => {
  const db = getDB();
  // Check here if ID of user matches ID of JWT token
  // Check here if field set matches
  try {

    console.log(" == updateUser: ", req.body);

    let sql = 'UPDATE users SET ? WHERE user_id = ?';
    let user = req.body;
    // Crypt the password if necessary
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 8);
    }


    db.query(sql, [user, req.params.id], function(err, results) {
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
 * Delete a User account
 *
 */
// router.delete('/:id/reset', async (req, res, next) => {
//   res.status(200).send({
//     body: 'delete an account'
//   });
// });


/*
 * Reset a User account - Delete all Categories & Tasks
 *
 * @TODO enable authentication with requireAuth pre-route
 * router.delete('/:id/reset', requireAuth, (req, res, next) => {
 */
router.delete('/:id/reset', (req, res, next) => {
  const db = getDB();
  // Check here if ID of user matches ID of JWT token
  //
  try {

    console.log(" == resetUser: ", req.params.id);

    // ON CASCADE will delete tasks when categories are deleted
    let sql = 'DELETE from categories WHERE user_id = ? ;';

    db.query(sql, req.params.id, function(err, results) {
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


/*
 * Attempt to log a user in
 *
 */
router.post('/login', async (req, res, next) => {
  const db = getDB();

  try {
    // Fetch user details from the data base
    dbUser = {
      id: 1000,
      username:'fake',
      email: 'fake@example.org',
      password: await bcrypt.hash('password', 8)
    }

    input = req.body;
    console.log("== dbUser", dbUser, "input", input);

    // verify password
    const auth = dbUser && await bcrypt.compare(input.password, dbUser.password)
    console.log("== pwd cmp", await bcrypt.compare(input.password, dbUser.password))
    if (auth) {

      // frontend does not need password
      delete dbUser.password;

      // Generate a JWT token with the user payload
      const token = genAuthToken(dbUser);

      res.status(200).send({
        token: token
      });
    } else {
      next(new TomatoError("Authentication failed.", 401));
    }
  } catch (err) {
    console.error(err);
    next(new TomatoError("Authentication error.  Please try again later.", 500));
  }
});


module.exports = router;
