import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import config from '@server/config'

const loadService = async () => {
  try {
    // @ts-ignore
    return await import('./serviceAccountKey.json')
  } catch (error) {
    if (config.env === 'production') {
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FS_PROJECT_ID,
        private_key_id: process.env.FS_PRIVATE_KEY_ID,
        private_key: (process.env.FS_PRIVATE_KEY as string).replace(
          /\\n/g,
          '\n'
        ),
        client_email: process.env.FS_CLIENT_EMAIL,
        client_id: process.env.FS_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FS_CERT_URL,
        universe_domain: 'googleapis.com',
      } as ServiceAccount
      return serviceAccount
    }
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
