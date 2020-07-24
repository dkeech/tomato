/* @tasks.js
 *
 * Routes for /tasks
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
 * Get all Tasks for a User
 *
 */
router.get('/', async (req, res, next) => {
  const db = getDB();

  // Fetch ID from JWT token
  let user_id = 1;
  try {

    console.log(" == getTasks: ", user_id);

    let sql = 'SELECT * from tasks WHERE user_id = ?';

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
 * Create a new Task
 *
 */
router.post('/', async (req, res, next) => {
  const db = getDB();
  //  Validate required fields here
  // Fetch ID from JWT token
  let user_id = 1;
  if (true) {
    try {

      console.log(" == insertNewTask: ", req.body);

      let sql = 'INSERT INTO tasks (user_id, category_id, task_name, description, time_duration) VALUES (?, ?, ?, ?, ?)';
      const task = [
        user_id,
        req.body.category_id,
        req.body.task_name,
        req.body.description,
        req.body.time_duration,
      ];

      console.log("== task", task);
      db.query(sql, task, function(err, results) {
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
      next(new TomatoError("Internal error adding tas: " + err.message, 500));
    }

  } else {
    next(new TomatoError("Request is not valid", 400));
  }
});

/*
 * Get details of a Task
 *
 */
router.get('/:id', async (req, res, next) => {
  const db = getDB();

  // Check here if ID of user matches ID of JWT token
  //
  try {

    console.log(" == getTaskDetails: ", req.params.id);

    let sql = 'SELECT * FROM tasks WHERE task_id = ?';

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
 * Update a Task
 *
 */
router.patch('/:id', async (req, res, next) => {
  const db = getDB();
  // Check here if ID of user matches ID of JWT token
  // Check here if field set matches
  try {

    console.log(" == updateTask: ", req.body);

    let sql = 'UPDATE tasks SET ? WHERE task_id = ?';

    db.query(sql, [req.body, req.params.id], function(err, results) {
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
 * Delete a Task
 *
 */
router.delete('/:id', async (req, res, next) => {
  const db = getDB();
  console.log(" == deleteTask: ", req.params.id);

  // Fetch user ID from JWT token
  user_id = 1;

  try {

    console.log(" == deleteTask: ", req.params.id);

    // Delete all tasks for this user
    let sql = 'DELETE from tasks WHERE task_id = ?';

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



module.exports = router;
