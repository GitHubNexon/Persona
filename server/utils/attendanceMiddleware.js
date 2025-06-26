// utils/attendanceMiddleware.js
const UAParser = require("ua-parser-js");

const getDeviceDetails = (req) => {
  const parser = new UAParser();
  parser.setUA(req.headers["user-agent"]);

  const result = parser.getResult();

  return {
    model: result.device.model || "Unknown",
    os: result.os.name ? `${result.os.name} ${result.os.version}` : "Unknown",
    browser: result.browser.name || "Unknown",
  };
};

const getIpAddress = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.connection.remoteAddress;
};

module.exports = {
  getDeviceDetails,
  getIpAddress,
};
