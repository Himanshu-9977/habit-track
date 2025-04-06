const crypto = require("crypto")

// Generate VAPID keys
function generateVAPIDKeys() {
  const vapidKeys = {
    publicKey: crypto.randomBytes(32).toString("base64").replace(/\+/g, "-").replace(/\//g, "_"),
    privateKey: crypto.randomBytes(32).toString("base64").replace(/\+/g, "-").replace(/\//g, "_"),
  }

  return vapidKeys
}

// Generate CRON secret
function generateCronSecret() {
  return crypto.randomBytes(32).toString("hex")
}

const vapidKeys = generateVAPIDKeys()
const cronSecret = generateCronSecret()

console.log("VAPID Public Key:", vapidKeys.publicKey)
console.log("VAPID Private Key:", vapidKeys.privateKey)
console.log("CRON Secret:", cronSecret)
console.log("\nAdd these to your .env.local file:")
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`)
console.log(`CRON_SECRET=${cronSecret}`)

