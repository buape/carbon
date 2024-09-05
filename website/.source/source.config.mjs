// source.config.ts
import {
  defineConfig,
  defineDocs,
  frontmatterSchema
} from "fumadocs-mdx/config";
import { z } from "zod";
var { docs, meta } = defineDocs({
  docs: {
    dir: "content",
    schema: frontmatterSchema.extend({
      index: z.boolean().default(false)
    })
  }
});
var source_config_default = defineConfig({
  generateManifest: true,
  lastModifiedTime: "git"
});
export {
  source_config_default as default,
  docs,
  meta
};
