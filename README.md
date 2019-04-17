# Making SQL Cool Again Data Loader
This project two SQL scripts: `create.sql` and `drop.sql`.  The
first script creates schemas, tables and indices.  `drop.sql` drops
everything created by `create.sql`.

There is also a data loading script located at `scripts/load-data.js`.  To use it, you first need to install the dependencies via `npm install`.  To run it, execute:
 ```
 node load-data.js $NUMBER_OF_PRODUCTS $SCHEMA_NAME
 ```
The script  is written to connect to a Postgres DB running locally.  It also connects to the default `postgres` database using the default `postgres` user.  You can download Postgres at [https://www.postgresql.org/download/](https://www.postgresql.org/download/).

If you are planning to load ALOT of data, you may want to create
the tables without the `foreign key` constraints and add those back later.  You may also want to remove indices and add them later as well.  This will help speed things up.