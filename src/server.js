import { app } from "./app.js";
import { PORT } from "./config/env.js";
import connectToDBWithRetry from "./db/mongo_db_client.js";

connectToDBWithRetry()
  .then(() => {
    app.listen(PORT || 8080, () => {
      console.log(`Connected to PORT: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
