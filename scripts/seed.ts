import { config } from "dotenv";
config({ path: ".env.local" });

import { seed } from "../src/lib/seed";

seed()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding:", err);
    process.exit(1);
  });
