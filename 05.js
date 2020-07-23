const http = require("http");
const https = require("https");
const querystring = require("querystring");
const URL = require("url").URL;

class HttpRequest {
  submit(method, url, data = null, params = {}) {
    return typeof process !== "undefined"
      ? this.send(method, url, data, params)
      : this.fetch(method, url, data, params);
  }

  static get(url, params = {}) {
    return new this().submit("GET", url, null, params);
  }

  static post(url, data = {}, params = {}) {
    return new this().submit("POST", url, data, params);
  }

  static put(url, data = {}, params = {}) {
    return new this().submit("PUT", url, data, params);
  }

  static patch(url, data = {}, params = {}) {
    return new this().submit("PATCH", url, data, params);
  }

  static delete(url, params = {}) {
    return new this().submit("DELETE", url, null, params);
  }

  static options(url, params = {}) {
    return new this().submit("OPTIONS", url, null, params);
  }

  static head(url, data = {}, params = {}) {
    return new this().submit("HEAD", url, null, params);
  }

  async fetch(method, url, payload = null, params = {}) {
    const response = await fetch(url, { method });

    const headers = {};

    response.headers.forEach((item, key) => {
      headers[key] = item;
    });

    const type = response.headers.get("content-type");

    let data = {
      method: method,
      url: response.url,
      statusCode: response.status,
      statusMessage: response.statusText,
      headers: headers,
    };

    if (payload) {
      if (type === "application/json" && response.hasOwnProperty("json")) {
        data["body"] = await response.json();
      } else if (type === "text/html") {
        data["body"] = await response.text();
      }
    }

    return data;
  }

  send(method, url, data = null, params = {}) {
    return new Promise((resolve, reject) => {
      const queries = querystring.stringify(params);
      const requestUrl = new URL(url + "?" + queries);

      let requester = /^https/.test(requestUrl.toString()) ? https : http;

      const options = {
        method: method,
        path: requestUrl.pathname + "?" + requestUrl.searchParams,
        protocol: requestUrl.protocol,
        hostname: requestUrl.hostname,
        port: requestUrl.port,
        headers: {},
      };

      const request = requester.request(options, (incomingMessage) => {
        let rawData = "";

        incomingMessage.on("data", (chunk) => (rawData += chunk));

        incomingMessage.on("end", () => {
          const response = {
            method: method,
            url: incomingMessage.url,
            statusCode: incomingMessage.statusCode,
            statusMessage: incomingMessage.statusMessage,
            headers: incomingMessage.headers,
          };

          const type = incomingMessage.headers["content-type"];

          if (["HEAD", "OPTIONS"].indexOf(method) === -1) {
            if (type === "application/json") {
              response["body"] = JSON.parse(rawData);
            }
          }

          resolve(response);
        });
      });

      request.on("response", (res) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject("Error status code " + res.statusCode);
        }
      });

      request.on("error", (err) => {
        reject(err);
      });

      request.end();
    });
  }
}

HttpRequest.get("https://httpbin.org/get?message=Hello+World&show=true")
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

HttpRequest.post("https://httpbin.org/post", { username: "mul14" })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

HttpRequest.put("https://httpbin.org/put", { username: "mul14" })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

HttpRequest.patch("https://httpbin.org/patch", { username: "mul14" })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

HttpRequest.delete("https://httpbin.org/delete", { username: "mul14" })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

HttpRequest.head("https://httpbin.org/get")
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

HttpRequest.options("https://httpbin.org/get")
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
