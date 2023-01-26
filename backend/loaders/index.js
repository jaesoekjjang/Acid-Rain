import mysqlLoader from "./mysql.js";

export default async (app) => {
  const mysqlPool = await mysqlLoader();
  return { mysqlPool };
};
