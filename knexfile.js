// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URI || 'postgresql://localhost/pgfiddle_dev'
  },
  test: {
    client: 'postgresql',
    connection: process.env.DATABASE_URI || 'postgresql://localhost/pgfiddle_test'
  },
  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URI || 'postgresql://localhost/pgfiddle'
  }
};
