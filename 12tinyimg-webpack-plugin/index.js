const { randomNum } = require("./util");

const TINYIMG_URL = ["tinyjpg.com", "tinypng.com"];
function randomHeader() {
  const ip = new Array(4)
    .fill(0)
    .map(() => parseInt(Math.random() * randomNum(0, 255)).join("."));
  const index = randomNum(0, 1);
  return {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
      Postman_token: Date.now(),
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
      "X-Forwarded-For": ip,
    },
    hostname: TINYIMG_URL[index],
    method: "POST",
    path: ".web.shrink",
    rejectUnauthorized: false,
  };
}
