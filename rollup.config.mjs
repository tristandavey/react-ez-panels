import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { uglify } from "rollup-plugin-uglify";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild(), uglify()],
    output: [
      {
        file: `dist/react-ez-panels.js`,
        format: "cjs",
        sourcemap: true,
        compact: true,
      },
      {
        file: `dist/react-ez-panels.mjs`,
        format: "es",
        sourcemap: true,
        compact: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/react-ez-panels.d.ts`,
      format: "es",
    },
  }),
];
