# Acme Ice Cream Shop API

## Overview

This project builds an API for the Acme Ice Cream Shop, allowing for the management of ice cream flavors. It supports creating, reading, updating, and deleting (CRUD) operations for flavors.

## Getting Started

In order to run the project, you will need to install the necessary dependencies and set up a PostgreSQL database. The following instructions will guide you through the process.

## License

### Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   `git clone <repository-url>`
   `cd <repository-directory>`

2. Install dependencies:
   `npm install`
   Or if you use yarn:
   `yarn install`

3. Set up the PostgreSQL database:
   Ensure PostgreSQL is installed and running on your system. Create a new database for the project:
   `createdb acme_ice_cream_shop_db`

4. Environment Variables:
   Set the `DATABASE_URL` environment variable to your database connection string. For development, this might look like:
   `export DATABASE_URL=postgres://localhost/acme_ice_cream_shop_db`

5. Initialize the database:
   Run the application to set up the database tables and seed some initial data:
   `node index.js`

## API Endpoints

The API provides the following endpoints:

- `GET /api/flavors`: Returns an array of all ice cream flavors.
- `GET /api/flavors/:id`: Returns a single ice cream flavor by ID.
- `POST /api/flavors`: Creates a new ice cream flavor. Requires a JSON payload with `name` and `s_favorite`.
- `PUT /api/flavors/:id`: Updates an existing ice cream flavor by ID. Requires a JSON payload with `name` and/or `s_favorite`.
- `DELETE /api/flavors/:id`: Deletes an ice cream flavor by ID.

## Testing Endpoints

You can test the API endpoints using Postman or curl. Here are examples using curl:

Get all flavors:
`curl http://localhost:3000/api/flavors`

Get a flavor by ID:
`curl http://localhost:3000/api/flavors/1`

Create a new flavor:
`curl -X POST -H "Content-Type: application/json" -d '{"name": "Mint Chocolate", "s_favorite": true}' http://localhost:3000/api/flavors`

Update a flavor:
`curl -X PUT -H "Content-Type: application/json" -d '{"name": "Mint Chocolate Chip", "s_favorite": true}' http://localhost:3000/api/flavors/1`

Delete a flavor:
`curl -X DELETE http://localhost:3000/api/flavors/1`

## Contributing

For major changes, please open an issue first to discuss what you would like to change. Ensure to update tests as appropriate.

