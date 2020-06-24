import Vue from 'vue'
import crypto from 'crypto'
import Datastore from 'nedb-promises'
import { remote } from 'electron'

const algorithm = 'aes-128-cbc'
const password = 'xx'
const key = crypto.scryptSync(password, 'salt', 16)
const iv = Buffer.alloc(16, 0)

const basePath = remote.app.getPath('userData')
console.log('basePath: ', basePath)

const db = new Datastore({
  autoload: true,
  timestampData: true,
  filename: basePath,
  afterSerialization(plaintext) {
    // 实例化一个cipher加密对象，使用加密算法进行加密，key作为密钥
    // 使用cipher对 plaintext 进行加密，源数据类型为utf-8，输出数据类型为hex
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let crypted = cipher.update(plaintext, 'utf-8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  },
  beforeDeserialization(ciphertext) {
    // 实例化一个decipher解密对象，使用解密算法进行解密，key作为密钥
    // 使用decipher对 ciphertext 进行解密，源数据类型为hex，输出数据类型为utf-8
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(ciphertext, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
  }
})
Vue.prototype.$db = db
