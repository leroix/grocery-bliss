import React from 'react'
import './Homepage.css'

const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID

export default (props) => {
  return (
    <div className="Homepage">
      <img className="Homepage__logo" src="/logo.svg" alt="grocery bliss logo" />
      <a
        onClick={evt => {
          evt.preventDefault()
          window.localStorage.setItem('githubOauthState', Math.random().toString())
          window.location = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&state=${window.localStorage.getItem('githubOauthState')}`
        }}
        className="Homepage__github_login"
        >
        {props.loggingIn ? 'Logging in...' : 'Login with GitHub'}
      </a>
    </div>
  )
}
