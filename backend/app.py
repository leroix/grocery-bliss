#!/usr/bin/env python3
import os
import binascii

import connexion

app = connexion.FlaskApp(
    __name__,
    specification_dir=os.path.dirname(os.path.realpath(__file__)) + '/swagger/'
)

app.add_api('swagger.yaml')

flask_app = app.app

flask_app.config['GITHUB_CLIENT_ID'] = os.environ['GB_GITHUB_CLIENT_ID']
flask_app.config['GITHUB_CLIENT_SECRET'] = os.environ['GB_GITHUB_CLIENT_SECRET']
flask_app.config['SECRET_KEY'] = \
    os.environ.get('GB_SECRET_KEY') or binascii.hexlify(os.urandom(16)).decode('utf8')

if __name__ == '__main__':
    app.run(port=os.environ.get('GB_PORT', 5000),
            host=os.environ.get('GB_HOST', '0.0.0.0'),
            server=os.environ.get('GB_BACKEND', 'flask'),
            debug=os.environ.get('GB_DEBUG'))
