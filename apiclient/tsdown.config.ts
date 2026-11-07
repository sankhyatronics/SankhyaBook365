export default {
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: {
    // Force .d.ts instead of .d.cts/.d.mts
    respectExternal: true,
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      outDir: 'dist'
    }
  },
  clean: true,
  sourcemap: true
}