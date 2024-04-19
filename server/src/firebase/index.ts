import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import config from '@server/config'

const loadService = async () => {
  try {
    // @ts-ignore
    return await import('./serviceAccountKey.json')
  } catch (error) {
    return false
  }
}

let app = null
const serviceAccount = await loadService()

if (config.firebase.bucket && serviceAccount) {
  app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    storageBucket: config.firebase.bucket,
  })
}

export const bucket = app && getStorage(app).bucket()
