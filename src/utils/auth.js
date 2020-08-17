import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const osKey = 'OS-Key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getOS() {
  console.log(Cookies.get(osKey))
  return Cookies.get(osKey)
}

export function setOS(osData) {
  console.log(osData)
  return Cookies.set(osKey, osData)
}

export function removeOS() {
  return Cookies.remove(osKey)
}