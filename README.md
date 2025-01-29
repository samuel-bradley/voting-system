### How to run

#### With Docker

1. Ensure Docker Desktop or Docker Engine is installed and running

2. Open a terminal in the project root

3. Verify Node.js and npm are installed with `node --version` and `npm --version` and install them if not

4. Install dependencies with `npm install` and wait for it to complete

5. Create a `.env` file in the project root and insert `DATABASE_URL=postgres://postgres:postgres@db:5432/voting_system`

6. Build and start the containers with `docker compose up --build` and wait for the database container to finish starting - there should be a log message like "server started"

7. Run the migrations with `npx node-pg-migrate --config-file pg-migrate-config.json up` - this should yield log output terminating in

    > Migrations complete!

Once the website container is running, the site should be visible at http://localhost:3000 (it will take a moment to compile on the first request).

#### Without Docker

It is possible to run the project without Docker by repeating the above steps, but running a local Postgres instance configured with the same username, password and database name as in `docker-compose.yml` and running `npm run dev` instead of `docker compose`. Also change the value of `DATABASE_URL` in `.env` to `postgres://postgres:postgres@localhost:5432/voting_system`.
