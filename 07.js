class Validator {
  constructor(data = {}, rules = {}, message = {}) {
    this._data = data;
    this._rules = rules;
    this._message = message;
    this._errors = {};
    this.validate();
  }

  validate() {
    for (const [key, value] of Object.entries(this._rules)) {
      const rules = value.split("|");

      for (const rule of rules) {
        const methodName = this.validationMethod(rule);
        this[methodName](key, this._data[key], rule.split(":")[1]);
      }
    }
  }

  validationMethod(rule) {
    const methodName = rule.includes(":") ? rule.replace(/:.+/, "") : rule;
    return "validate" + methodName.charAt(0).toUpperCase() + methodName.slice(1);
  }

  addError(key, message) {
    if (!Array.isArray(this._errors[key])) {
      this._errors[key] = [];
    }

    this._errors[key].push(message.replace("%s", key));
  }

  validateRequired(key, value) {
    let hasError = false;

    if (typeof value === "string" && !value.trim()) {
      hasError = true;
    } else if (value && Object.keys(value).length === 0 && value.constructor === Object) {
      hasError = true;
    } else if (value && Array.isArray(value) && !value.length) {
      hasError = true;
    } else if (typeof value === "undefined" || value === null) {
      hasError = true;
    }

    if (hasError) {
      this.addError(key, this._message[key] || "The %s field is required");
      return false;
    }

    return true;
  }

  validateAlphanum(key, value) {
    if (!new RegExp(/^[A-z0-9]+$/, "g").test(value)) {
      this.addError(key, this._message[key] || "The %s field is not alpha numeric");
      return false;
    }

    return true;
  }

  validateEmail(key, value, params = []) {
    if (!new RegExp(/@/).test(value)) {
      this.addError(key, this._message[key] || "The %s field is not an email");
      return false;
    }

    return true;
  }

  validateNumeric(key, value, params = []) {
    if (!new RegExp(/\d+/).test(value)) {
      this.addError(key, this._message[key] || "The %s field is not numeric");
      return false;
    }

    return true;
  }

  validateBoolean(key, value, params = []) {
    if (typeof value !== "boolean") {
      this.addError(key, this._message[key] || "The %s field is not a boolean");
      return false;
    }

    return true;
  }

  validateMin(key, value, params = []) {
    const minValue = parseInt(params[0]);

    if (typeof value === "number") {
      value = Number(value);
    }

    if (typeof value === "string") {
      value = value.length;
    }

    if (value < minValue) {
      this.addError(key, this._message[key] || "The %s minimum is " + minValue);
      return false;
    }

    return true;
  }

  first(key) {
    if (this.errors().hasOwnProperty(key)) {
      return this.errors()[key][0];
    }
    return null;
  }

  has(key) {
    return !!this.first(key);
  }

  fails() {
    return !!this.errors();
  }

  passes() {
    return !this.fails();
  }

  errors() {
    return Object.keys(this._errors).length > 0 ? this._errors : null;
  }
}

const data = {
  username: "&@^",
  email: "",
  name: "",
  zip: "75324",
  is_admin: 1,
  age: 15,
};

const rules = {
  username: "required|alphanum",
  email: "required|email",
  name: "required",
  zip: "required|numeric",
  is_admin: "boolean",
  age: "numeric|min:21",
};

const message = {
  required: "The %s field is required",
  age: "The %s field must a number",
};

const validator = new Validator(data, rules, message);

console.log(validator.fails());
console.log(validator.passes());
console.log(validator.errors());
console.log(validator.has("name"));
console.log(validator.first("name"));
