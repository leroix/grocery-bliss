#!/usr/bin/env python3
import os
import binascii

import connexion
import click

connexion_app = connexion.FlaskApp(
    __name__,
    specification_dir=os.path.dirname(os.path.realpath(__file__)) + '/swagger/'
)

app = connexion_app.app

app.config['GITHUB_CLIENT_ID'] = os.environ['GB_GITHUB_CLIENT_ID']
app.config['GITHUB_CLIENT_SECRET'] = os.environ['GB_GITHUB_CLIENT_SECRET']
app.config['SECRET_KEY'] = \
    os.environ.get('GB_SECRET_KEY') or binascii.hexlify(os.urandom(16)).decode('utf8')

with app.app_context():
    connexion_app.add_api('swagger.yaml')

@app.shell_context_processor
def make_shell_context():
    return dict(app=app)

@app.cli.command()
def test():
    """Run the tests."""
    import tests
    tests.run(app)
    click.echo(click.style('✓ All tests passed', fg='green'))

@app.cli.command()
def run_connexion():
    connexion_app.run(port=os.environ.get('GB_PORT', 5000),
            host=os.environ.get('GB_HOST', '0.0.0.0'),
            server=os.environ.get('GB_BACKEND', 'flask'),
            debug=os.environ.get('GB_DEBUG'))


if __name__ == '__main__':
    run_connexion()
