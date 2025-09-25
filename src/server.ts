import { app } from "./app.ts";
import { env } from "./env";

app.listen({ 
  host: '0.0.0.0',
  port: env.PORT 
}).then(() => {
  if (env.NODE_ENV === 'dev') {
    console.log(`HTTP Server is running on http://localhost:${env.PORT}`);
  } else {
    console.log(`HTTP Server is running on port ${env.PORT}`);
  }
});
