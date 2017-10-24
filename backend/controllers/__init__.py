import sys
import uuid
import time
import http.client
import os
import binascii

import connexion
from flask import current_app, session
import requests

def csrf(f):
    def wrapped_controller(*args, **kwargs):
        if connexion.request.cookies['csrf'] != connexion.request.headers['X-Csrf']:
            return ({'message': 'CSRF check failed.'}, 403)
        return f(*args, **kwargs)

def login():
    body = connexion.request.get_json()

    token_resp = requests.post(
        'https://github.com/login/oauth/access_token',
        headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        json={
            'code': body['code'],
            'state': body.get('state'),
            'client_id': current_app.config['GITHUB_CLIENT_ID'],
            'client_secret': current_app.config['GITHUB_CLIENT_SECRET']
        }
    )

    token_resp_body = token_resp.json()

    if token_resp.status_code > 299 or token_resp_body.get('error'):
        print(token_resp.status_code, token_resp_body)
        return ({'message': 'authentication failure'}, 401)

    access_token = token_resp_body['access_token']

    user_resp = requests.get(
        'https://api.github.com/user',
        headers={
            'Accept': 'application/json',
            'Authorization': 'token ' + access_token
        }
    )

    user = user_resp.json()

    session['user_id'] = str(user['id'])

    return ({
        'user_id': str(user['id']),
        'username': user['login'],
        'avatar_url': user['avatar_url'],
        'github_access_token': access_token
    }, 200, {
        'Set-Cookie': 'csrf=' + binascii.hexlify(os.urandom(16)).decode('utf8') + '; path=/'
    })


def logout():
    session.clear()
    return ({'message': 'ok'}, 200, {
        'Set-Cookie': 'csrf=; Expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/'
    })
