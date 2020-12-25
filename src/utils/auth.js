// import Cookies from 'js-cookie'

export function getSession(name) {
  return sessionStorage.getItem(name)
}

export function setSession(name, value) {
  return sessionStorage.setItem(name, value)
}

export function removeSession(name) {
  return sessionStorage.removeItem(name)
}
