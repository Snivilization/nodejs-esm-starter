
export default {
  input: './out-tsc/main.js',
  output: {
    "format": "es",
    file: 'dist/starter-bundle.js',
    "plugins": []
  },
  plugins: [],
  treeshake: true
}
