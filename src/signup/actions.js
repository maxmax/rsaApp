import { SIGNUP_REQUESTING } from './constants'

const signupRequest = function signupRequest ({ username, email, password }) {
  console.log('called')
  return {
    type: SIGNUP_REQUESTING,
    username,
    email,
    password,
  }
}

export default signupRequest
