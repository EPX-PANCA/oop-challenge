const fs = require("fs");
const Nedb = require("nedb");
const mysql = require("mysql2/promise");

class Config {
  constructor(config) {
    this.config = config;
  }

  put(key, value) {
    this.config.put(key, value);
  }

  get(key) {
    return this.config.get(key);
  }

  remove(key) {
    this.config.remove(key);
  }
}

class ConfigFileStorage {
  constructor(file) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");

    this.file = file;
    this.data = JSON.parse(fs.readFileSync(this.file).toString());
  }

  get(key) {
    this.data = JSON.parse(fs.readFileSync(this.file).toString());

    const data = this.data.length ? this.data.find((item) => item.key == key) : undefined;

    console.log(data);

    return data;
  }

  put(key, value) {
    this.data = JSON.parse(fs.readFileSync(this.file).toString());

    const data = this.get(key);

    if (data) {
      this.data[this.data.indexOf(data)].value = value;
    } else {
      this.data.push({ key, value });
    }

    fs.writeFileSync(this.file, JSON.stringify(this.data));

    console.log({ key, value });
  }

  remove(key) {
    this.data = JSON.parse(fs.readFileSync(this.file).toString());

    this.data.splice(
      this.data.findIndex((value) => value.key == key),
      1
    );

    console.log(this.data);

    fs.writeFileSync(this.file, JSON.stringify(this.data));
  }
}

class ConfigNedb {
  constructor(file) {
    this.db = new Nedb({ filename: file, autoload: true });
  }

  put(key, value) {
    this.db.find({}, (error, docs) => {
      const data = docs.find((value) => value.key == key);

      console.log(data);

      if (data) {
        this.db.update({ _id: data._id }, { key, value }, (error, docs) => {
          if (error) {
            console.log(error);
          } else {
            console.log(docs);
          }
        });
      } else {
        this.db.insert({ key, value }, (error, docs) => {
          if (error) {
            console.log(error);
          } else {
            console.log(docs);
          }
        });
      }
    });
  }

  get(key) {
    this.db.findOne({ key }, (error, docs) => console.log(docs));
  }

  remove(key) {
    this.db.remove({ key }, (error, docs) => console.log(docs));
  }
}

class ConfigMysql {
  constructor(connection) {
    this.connection = connection;
  }

  async connect() {
    return await mysql.createConnection(this.connection);
  }

  put(key, value) {
    //
  }

  async get(key) {
    try {
      const db = await this.connect();
      const [row] = await db.execute("SELECT * FROM `config` WHERE `key` = ? LIMIT 1", [key]);
      db.end();

      const data = row.length ? row[0].value : undefined;

      console.log(data);

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  remove(key) {
    //
  }
}

// const config = new Config(new ConfigFileStorage("config.json"));
// const config = new Config(new ConfigNedb("data.db"));
const config = new Config(
  new ConfigMysql({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
  })
);
// config.put("site_name", "Blog"); // Be able to save string.
// config.put("maintenance", false); // Be able to save boolean.
// config.put("age", 30); // Be able to save number.
// config.put("meta", { description: "lorem ipsum" }); // Be able to save object or array.
// config.get("site_name"); // Will return "Blog".
// config.put("site_name", "Perfect Blog"); // Will update the "site_name" with new value.
// config.remove("site_name"); // Remove "site_name" key.
