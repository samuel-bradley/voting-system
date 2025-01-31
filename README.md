### How to run

#### With Docker

1. Ensure Docker Desktop or Docker Engine is installed and running

2. Open a terminal in the project root

3. Verify Node.js and npm are installed with `node --version` and `npm --version` and install them if not

4. Install dependencies with `npm install` and wait for it to complete

5. Create a `.env` file in the project root and insert `DATABASE_URL=postgres://postgres:postgres@db:5432/voting_system`

6. Build and start the containers with `docker compose up --build` and wait for the database container to finish starting - there should be a log message like "server started"

7. Run the migrations with `npm run migrate:up` - this should yield log output terminating in

    > Migrations complete!

Once the website container is running, the site should be visible at http://localhost:3000 (it will take a moment to compile on the first request).

#### Without Docker

It is possible to run the project without Docker by repeating the above steps, but running a local Postgres instance configured with the same username, password and database name as in `docker-compose.yml` and running `npm run dev` instead of `docker compose`. Also change the value of `DATABASE_URL` in `.env` to `postgres://postgres:postgres@localhost:5432/voting_system`.

### How to use

#### Public user interaction

At http://localhost:3000 you will see the latest active poll with voting options, if one exists. Voting for an option will refresh the active poll and display the percentage for each vote.

#### Admin user interaction

The app exposes a Swagger interface for interacting with the API (which is fairly minimal, according to the parameters of the exercise) at http://localhost:3000/swagger. There it is possible to create a poll with the
`/poll/create` endpoint and view the votes and corresponding timestamps for a poll's options with `/poll/{pollId}/votes`. The remainder of the endpoints (voting on and retrieving a poll) are used by the frontend component.

### Running the tests

It is possible to run the tests with `npm test`. Note that only the frontend component is currently tested. Testing the current API code would require mocking of the database - potentially the best course for improvement here is to split API logic out into a separate service and test that.
