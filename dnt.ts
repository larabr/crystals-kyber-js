import { build, emptyDir } from "dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: "both",
  test: true,
  declaration: "inline",
  scriptModule: false, // no commmonJS output
  importMap: "./deno.json",
  compilerOptions: {
    lib: ["ES2022", "DOM"],
  },
  shims: {
    deno: "dev",
  },
  package: {
    name: "@openpgp/crystals-kyber-js",
    version: Deno.args[0]?.replace(/^@openpgp\//, ""),
    description:
      "A ML-KEM implementation written in TypeScript",
    repository: {
      type: "git",
      url: "git+https://github.com/openpgpjs/crystals-kyber-js.git",
    },
    homepage: "https://github.com/openpgpjs/crystals-kyber-js#readme",
    license: "MIT",
    module: "./esm/mod.js",
    types: "./esm/mod.d.ts",
    sideEffects: false,
    exports: {
      ".": {
        "import": "./esm/mod.js",
      },
    },
    keywords: [
      "crystals-kyber",
      "kyber",
      "ml-kem",
      "kem",
      "security",
      "encryption",
      "pqc",
      "post-quantum",
    ],
    engines: {
      "node": ">=18.0.0",
    },
    author: "Ajitomi Daisuke",
    bugs: {
      url: "https://github.com/openpgpjs/crystals-kyber-js/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
