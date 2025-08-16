import esbuild from 'esbuild';

const args = process.argv.slice(2);
const watch = args.length > 0 && /^(?:--watch|-w)$/i.test(args[0]);

/**
 * @type {esbuild.BuildOptions[]}
 */
const configs = [
  {
    entryPoints: ['src/index.ts'],
    logLevel: 'info'
  }
];

for (const config of configs) {
  const ctx = await esbuild.context({
    bundle: true,
    format: 'esm',
    platform: 'browser',
    outdir: 'dist',
    sourcemap: true,
    packages: 'bundle',
    ...config,
  });

  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}