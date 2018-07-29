import { call, put, takeLatest } from 'redux-saga/effects'
import { handleApiErrors } from '../lib/api-errors'
import {
  SIGNUP_REQUESTING,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
} from './constants'

// The url derived from our .env file
// const signupUrl = `${process.env.REACT_APP_API_URL}/api/Clients`
// "birthCountryId": 1,
// "birthDate": "1980-03-23T00:00:00Z",
// "email": "md5555g56675578@gmail.com",
// "fullName": "Maxmax",
// "linkedinHandle": "maxkv",
// "password": "qq112233",
// "phone": "80636801133"
//
// const signupUrl = 'https://morning-ridge-81350.herokuapp.com/api/users'
// const signupUrl = 'http://localhost:1337/auth/local/register'
const signupUrl = 'https://hidden-falls-59190.herokuapp.com/auth/local/register'

function signupApi (username, email, password) {
  // call to the "fetch".  this is a "native" function for browsers
  // that's conveniently polyfilled in create-react-app if not available
  return fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({ birthCountryId, birthDate, email, fullName, password }),
    body: JSON.stringify({ username, email, password }),
  })
    .then(handleApiErrors) // we'll make this in a second
    .then(response => response.json())
    .then(json => json)
    .catch((error) => { throw error })
}

// This will be run when the SIGNUP_REQUESTING
// Action is found by the watcher
function* signupFlow (action) {
  try {
    const { username, email, password } = action
    // pulls "calls" to our signupApi with our email and password
    // from our dispatched signup action, and will PAUSE
    // here until the API async function, is complete!
    const response = yield call(signupApi, username, email, password)

    // when the above api call has completed it will "put",
    // or dispatch, an action of type SIGNUP_SUCCESS with
    // the successful response.
    yield put({ type: SIGNUP_SUCCESS, response })
  } catch (error) {
    // if the api call fails, it will "put" the SIGNUP_ERROR
    // into the dispatch along with the error.
    yield put({ type: SIGNUP_ERROR, error })
  }
}

// Watches for the SIGNUP_REQUESTING action type
// When it gets it, it will call signupFlow()
// WITH the action we dispatched
function* signupWatcher () {
  // takeLatest() takes the LATEST call of that action and runs it
  // if we we're to use takeEvery, it would take every single
  // one of the actions and kick off a new task to handle it
  // CONCURRENTLY!!!
  yield takeLatest(SIGNUP_REQUESTING, signupFlow)
}

export default signupWatcher
