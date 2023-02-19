import { container } from "./container.js";
import { mysqlLoader } from "./db.js";
import { expressLoader } from "./express.js";

export default async (app) => {
  expressLoader(app);

  const pool = await mysqlLoader();

  await container(app, pool);
};
