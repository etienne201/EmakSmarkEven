import { z } from "zod";
const schema = z.string();
console.log("Zod is working:", schema.parse("hello"));
