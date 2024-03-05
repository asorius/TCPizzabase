import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

import * as serviceAccount from './serviceAccountKey.json'

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'pizzabase-71be1.appspot.com',
})

export const bucket = getStorage(app).bucket()
