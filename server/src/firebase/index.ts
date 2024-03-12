import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import config from '@server/config'
import serviceAccount from './serviceAccountKey.json'

const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: config.firebase.bucket,
})

export const bucket = getStorage(app).bucket()
