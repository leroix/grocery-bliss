import React from 'react'
import FacebookLogin from 'react-facebook-login'
import './Homepage.css'

export default (props) => {
  return (
    <div className="Homepage">
      <img className="Homepage__logo" src="/logo.svg" alt="grocery bliss logo" />
      <div className="Homepage__fblogin">
        <FacebookLogin
          appId="1543007355792148"
          fields="name,email,picture"
          scope="public_profile,email,user_friends"
          callback={props.onFBLogin}
          />
      </div>
    </div>
  )
}
