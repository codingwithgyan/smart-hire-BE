require('dotenv').config()
const app = require("./app");
const connect = require("./config/db");
let port = process.env.PORT || 2345;
app.listen(port, async () => {
  try {
    await connect();
    console.log(`Listening on port ${port}`);
  } catch (e) {
    console.log(e);
  }
});