const fs = require("fs");

class Log {
  constructor(file) {
    this.file = file;
    
  }

  write(text, level = "INFO") {
    text = `[${new Date().toISOString()}] ${level}: ${text}\n`;
    fs.appendFileSync(this.file, text, { encoding: "utf8" });
  }

  info(text) {
    this.write(text);
  }

  error(text) {
    this.write(text, "ERROR");
  }

  notice(text) {
    this.write(text, "NOTICE");
  }

  warning(text) {
    this.write(text, "WARNING");
  }

  debug(text) {
    this.write(text, "DEBUG");
  }

  alert(text) {
    this.write(text, "ALERT");
  }

  critical(text) {
    this.write(text, "CRITICAL");
  }

  emergency(text) {
    this.write(text, "EMERGENCY");
  }
}

const log = new Log("app.log");

log.info("This is an information about something.")
log.error("We can't divide any numbers by zero.")
log.notice("Someone loves your status.")
log.warning("Insufficient funds.")
log.debug("This is debug message.")
log.alert("Achtung! Achtung!")
log.critical("Medic!! We've got critical damages.")
log.emergency("System hung. Contact system administrator immediately!")