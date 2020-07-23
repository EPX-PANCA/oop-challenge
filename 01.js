const crypto = require("crypto");

class Hash {
  static md5(text) {
    return crypto.createHash("md5").update(text).digest("hex");
  }
}

console.log(Hash.md5("admin"));
