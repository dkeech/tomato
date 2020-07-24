# tomato
osu cs-361 term project


# Technology stack

Frontend:
HTML
CSS
Javascript
Bootstrap 4

* NodeJS
* Express Engine
* Handlebars (possibly)
* MySQL
* jQuery / jQuery UI

# Architecture Diagram

![Image of Architecture](https://github.com/dkeech/tomato/blob/master/architecture_diagram.JPG)


# API Documentation

Tomato uses Swagger for Backend API documentation. Paste the contents of docs/tomato.yaml
into https://editor.swagger.com


# Server Setup

To set up the server, MySQL needs to be configured and the database schema imported.


## Create config file


* cp lib/config.dist.js lib/config.js
* Update lib/config.js with your MySQL credentials

## Import the development Schema

To use the class sql server, the system must be on OSU network or VPN.

* mysql -u cs361_onid -h classmysql.engr.oregonstate.edu cs361_onid < docs/db_schema.sql -p


## Start the dev server

By default it will start the server on port 9000. This can be changed with a PORT environment variable.

* npm start
* PORT=4000 npm start



## Testing with Postman

API Endpoints can be tested with the software Postman ( postman.com)

Import the collection docs/Tomato.postman.json
