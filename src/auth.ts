import { readFile, writeFile } from 'fs/promises'
import log from './log'

type UserId = string

const ID_FILE = '.dfac_id'

let cachedId: UserId | null = null

let newId = (): UserId => {
  return Math.floor(Math.random() * 1000000000).toString(16)
}

export let userId = async (): Promise<UserId> => {
  if (cachedId) {
    return cachedId
  }

  try {
    let diskId = await readFile(ID_FILE, { encoding: 'utf-8' })
    cachedId = diskId.trim()
  } catch (_) {
    cachedId = newId()
    writeFile(ID_FILE, cachedId).catch(err =>
      log.error({
        message: 'Unable to write user ID to disk',
        err,
      })
    )
  }

  return cachedId
}
