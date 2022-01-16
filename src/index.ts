var path = require('path');
const glob = require('glob')

// TODO: Load configuration file
//  - adapter configurfation
//  - fixture paths

const config = require(path.resolve(process.cwd(), 'ts-factories.ts')).default

let fixtures = {} as { [key: string]: CallableFunction }

export const fixture = function(name: string, cb: CallableFunction) {
  fixtures[name] = cb
}

export const create = function(name: string, options: any = {}) {
  let fixture = fixtures[name]()

  Object.keys(options).forEach((key: string) => fixture[key] = options[key])
  // TODO: afterCreate callback

  return fixture
}

export const createAndPersist = async function(name: string, options: any = {}) {
  let fixture = create(name, options)
  // TODO: beforePersist callback

  await config.em.persistAndFlush(fixture)
  return fixture

  // TODO: afterPersist callback
}

// TODO: use configuration file for paths
glob('tests/fixtures/**/*', (err:any, files:any) => {
  files.forEach((file:string) => {
    let filePath = path.resolve(process.cwd(), file)
    require(filePath)
  })
})
