import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { ImageResolver } from "./image";
import { MemoryResolver } from "./memory";
import { authChecker } from "./auth";

export const schema = buildSchemaSync({
  resolvers: [ImageResolver, MemoryResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
