const { Pool } = require("pg");
const { PG_PASSWORD } = require("../constants/protected");

class Connection {
  constructor() {
    if (!this.pool) {
      console.log("creating connection...");
      this.pool = new Pool({
        max: 100,
        host: "34.69.101.132",
        user: "postgres",
        password: PG_PASSWORD,
        database: "postgres",
      });
    }

    return this.pool;
  }
}

const instance = new Connection();

module.exports = instance;
