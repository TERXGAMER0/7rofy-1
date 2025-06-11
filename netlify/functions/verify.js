// netlify/functions/verify.js
const allowedCodes = require("./allowedCodes.json");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }
  const code = (body.code || "").trim();
  const valid = allowedCodes.includes(code);
  return {
    statusCode: valid ? 200 : 401,
    body: JSON.stringify({ valid })
  };
};
