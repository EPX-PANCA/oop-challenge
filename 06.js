class Auth {
  static account;
  static users = [
    { id: 1, username: "mul14", password: "secret", email: "mulia@example.com", last_login: "2018-02-03 12:11:35" },
    { id: 2, username: "root", password: "secret", email: "dart21@example.com", last_login: "2015-07-04 03:44:11" },
  ];

  static login(auth) {
    const temp = this.users.find((value) => value.username == auth.username && value.password == auth.password);

    if (temp) {
      this.account = temp;
      this.account.last_login = new Date().toISOString();

      console.log(JSON.stringify(temp));
    }
  }

  static validate(auth) {
    const temp = this.users.find((value) => value.username == auth.username && value.password == auth.password);

    if (temp) {
      console.log(JSON.stringify(temp));
    }
  }

  static logout() {
    this.account = undefined;
  }

  static user() {
    console.log(JSON.stringify(this.account));
  }

  static id() {
    console.log(this.account.id);
  }

  static check() {
    console.log(this.account ? "true" : "false");
  }

  static guest() {
    console.log(!this.account ? "true" : "false");
  }

  static lastLogin() {
    console.log(this.account.last_login);
  }
}

Auth.login({ username: "root", password: "secret" }); // If valid, user will log in.

Auth.validate({ username: "root", password: "secret" }); // Just verify username and password without log in.

Auth.logout(); // Log out the current logged in user.

Auth.user(); // Get information about current logged in user.

Auth.id(); // Get the User ID.

Auth.check(); // Will returns true if user already logged in.

Auth.guest(); // Will returns true if user not logged in.

Auth.lastLogin(); // Get
