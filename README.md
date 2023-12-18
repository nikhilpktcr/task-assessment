#Task

There is some key features:

- CRUD operations for customers (get, update, delete) by id or email;

- login and signup operations for customers;

- roles USER and ADMIN;

- access token;

- refresh token;

- restrict access to get customers operation from unauthenticated users;

- restrict access to delete customer and update customer operations from unauthenticated users and customers with USER role;

- ability to verify customer's account after signup with activation code;



## Installation

```bash

# Install packages
pnpm install
pnpm prisma generate

```
## Local database

```bash
# Setup local postgres
docker run --name recruitment-task -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11.16
pnpm install

#create .env file with your local database credentials

# Run migration
pnpm prisma migrate dev

```

# watch mode
pnpm start:dev

