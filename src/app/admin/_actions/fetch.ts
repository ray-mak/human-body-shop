"use server"

import { Buffer } from "buffer"
import msgpack5 from "msgpack5"

export async function fetchChallenge() {
  const email = "projectraymak@gmail.com"
  const url = `https://ciphersprint.pulley.com/${email}`
  console.log(url)
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText)
    }
    const data = await response.json()
    console.log(data)

    const secondPath = data.encrypted_path
    const secondUrl = `https://ciphersprint.pulley.com/${secondPath}`
    try {
      const secondResponse = await fetch(secondUrl)
      if (!secondResponse.ok) {
        throw new Error(
          "Second etwork response was not ok " + secondResponse.statusText
        )
      }
      const secondData = await secondResponse.json()
      console.log(secondData)

      const thirdPath = secondData.encrypted_path
      const asciiString = thirdPath.split("_")[1]
      const asciiArray = JSON.parse(asciiString)
      console.log(asciiArray)
      const asciiDecoded = await decode(asciiArray)
      const thirdUrl = `https://ciphersprint.pulley.com/task_${asciiDecoded}`
      try {
        const thirdResponse = await fetch(thirdUrl)
        if (!thirdResponse.ok) {
          throw new Error(
            "Third network response was not ok " + thirdResponse.statusText
          )
        }
        const thirdData = await thirdResponse.json()
        console.log(thirdData)

        const fourthPath = thirdData.encrypted_path
        const pathString = fourthPath.split("_")[1]
        const decodedPath = await decodeSwappedPairs(pathString)
        const fourthUrl = `https://ciphersprint.pulley.com/task_${decodedPath}`
        console.log(fourthUrl)
        try {
          const fourthResponse = await fetch(fourthUrl)
          if (!fourthResponse.ok) {
            throw new Error(
              "Fourth network response was not ok " + fourthResponse.statusText
            )
          }
          const fourthData = await fourthResponse.json()
          console.log(fourthData)

          const fifthPath = fourthData.encrypted_path
          const pathString = fifthPath.split("_")[1]
          const rotation = parseInt(fourthData.encryption_method.split(" ")[4])
          const decodedFifthPath = await rotate(pathString, rotation)
          const fifthUrl = `https://ciphersprint.pulley.com/task_${decodedFifthPath}`
          console.log(pathString, rotation)
          console.log(fifthUrl)

          try {
            const fifthResponse = await fetch(fifthUrl)
            if (!fifthResponse.ok) {
              throw new Error(
                "Fifth network response was not ok " + fifthResponse.statusText
              )
            }
            const fifthData = await fifthResponse.json()
            console.log(fifthData)

            const sixtPath = fifthData.encrypted_path
            const pathString = sixtPath.split("_")[1]
            const key = fifthData.encryption_method.split(" ")[9]
            console.log(pathString, key)
            const decodedPath = await xorDecrypt(pathString, key)
            const sixtUrl = `https://ciphersprint.pulley.com/task_${decodedPath}`
            console.log(sixtUrl)

            try {
              const sixthResponse = await fetch(sixtUrl)
              if (!sixthResponse.ok) {
                throw new Error(
                  "Sixth network response was not ok " +
                    sixthResponse.statusText
                )
              }
              const sixthData = await sixthResponse.json()
              console.log(sixthData)
            } catch (error) {
              console.error(
                "There was a problem with your sixth fetch operation:",
                error
              )
            }

            return { fifthData }
          } catch (error) {
            console.error(
              "There was a problem with your fifth fetch operation:",
              error
            )
          }
          return { fourthData }
        } catch (error) {
          console.error(
            "There was a problem with your fourth fetch operation:",
            error
          )
        }
        return { thirdData }
      } catch (error) {
        console.error(
          "There was a problem with your third fetch operation:",
          error
        )
      }

      return { secondData }
    } catch (error) {
      console.error(
        "There was a problem with your second fetch operation:",
        error
      )
    }
    return { data }
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error)
  }
}

async function decode(encrptedPath: number[]) {
  const decodedPath = encrptedPath
    .map((ascii) => String.fromCharCode(ascii))
    .join("")
  return decodedPath
}

async function decodeSwappedPairs(input: string) {
  let decodedPath = ""
  for (let i = 0; i < input.length; i += 2) {
    const pair = input.substring(i, i + 2)
    decodedPath += pair[1] + pair[0]
  }
  return decodedPath
}

async function rotate(str: string, rotation: number) {
  const n = str.length
  const effectiveRotation = rotation % n

  return str.slice(-effectiveRotation) + str.slice(0, -effectiveRotation)
}

async function xorDecrypt(str: string, key: string) {
  const encryptedBuffer = Buffer.from(str, "hex")
  const keyBuffer = Buffer.from(key)

  const decryptedBuffer = Buffer.alloc(encryptedBuffer.length)
  for (let i = 0; i < encryptedBuffer.length; i++) {
    decryptedBuffer[i] = encryptedBuffer[i] ^ keyBuffer[i % keyBuffer.length]
  }

  console.log("decryptedBuffer: ", decryptedBuffer)

  const hexStr = decryptedBuffer.toString("hex")
  return hexStr.toString()
}

async function decryptData(data: string) {
  const base64Buffer = Buffer.from(data, "base64")

  const unpacker = msgpack5()
  const decodedData = unpacker.decode(base64Buffer)
}
