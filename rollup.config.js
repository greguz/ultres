export default [
  {
    input: './async.mjs',
    output: {
      file: './async.cjs',
      format: 'cjs'
    },
    plugins: [
      useLocalImport()
    ]
  },
  {
    input: './result.mjs',
    output: {
      file: './result.cjs',
      format: 'cjs'
    }
  }
]

function useLocalImport () {
  return {
    name: 'useLocalImport',
    resolveId (source) {
      if (source === './result.mjs') {
        return { id: './result.cjs', external: true }
      } else {
        return null
      }
    }
  }
}
