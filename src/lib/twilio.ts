import twilio from "twilio"

const accountId = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountId, authToken)

export async function sendSMS(to: string, message: string) {
  try {
    const sms = await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    })
    return sms
  } catch (error) {
    console.error("Failed to send SMS: ", error)
    return error
  }
}
