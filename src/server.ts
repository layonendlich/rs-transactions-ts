import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.SERVICE_PORT,
    host: env.SERVICE_HOST,
  })
  .then(() => {
    console.log('HTTP server running on port', env.SERVICE_PORT)
    console.log(`http://localhost:${env.SERVICE_PORT}`)
  })
