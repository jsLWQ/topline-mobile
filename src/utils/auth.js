export const getUser = () => {
  return JSON.parse(window.localStorage.getItem('user'))
}
export const setUser = (data) => {
  window.localStorage.setItem('user', JSON.stringify(data))
}
export const removeUser = () => {
  window.localStorage.removeItem('user')
}
