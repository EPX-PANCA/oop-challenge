class Chiper {
  static DIVIDER = "1!@(!)@!&;/1"

  static encrypt(text, password) {
    if (password) {
      return text.split("").map(value => value.charCodeAt(0)).join(this.DIVIDER);
    } else {
      return "Anda tidak memiliki akses"
    }
  }

  static decrypt(text, password) {
    if (password) {
      return text.split(this.DIVIDER).map(value => String.fromCharCode(value)).join("");
    } else {
      return "Anda tidak memiliki akses"
    }
  }
}

const encrypt = Chiper.encrypt("admin", "password")
console.log(encrypt);
const decrypt = Chiper.decrypt(encrypt, "password")
console.log(decrypt);
