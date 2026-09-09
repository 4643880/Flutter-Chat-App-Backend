import { httpServer } from "./app.js";
import { PORT } from "./config/env.js";
import connectToDBWithRetry from "./db/mongo_db_client.js";

connectToDBWithRetry()
  .then(() => {
    httpServer.listen(PORT || 8080, () => {
      console.log(`Connected to PORT: http://localhost:${PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

// 1.5.27
