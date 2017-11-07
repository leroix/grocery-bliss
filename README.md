This repo contains the frontend UI for which you'll be designing and implementing a RESTful API. Here's a demo of the user experience that your API will make possible:

![grocery-bliss-demo](https://user-images.githubusercontent.com/520209/32475530-72a75b22-c32f-11e7-8b41-70d9e96f5297.gif)


## Getting Started
First, you'll need a https://github.com/ account. Head to https://github.com/settings/developers and create a new OAuth App. Use "http://localhost:3000" as the "Authorization callback URL". You'll need the "Client Id" and "Client Secret" later.

### Frontend
It will be helpful to use https://github.com/creationix/nvm to manage your node.js versions. This project uses v8.4.0. `cd ./frontend` and run `npm install`. Make sure that `REACT_APP_GITHUB_CLIENT_ID` is set in your environment (i.e. `export REACT_APP_GITHUB_CLIENT_ID=<your github client id>`). Run `npm start` and a browser tab should open with the GroceryBLISS login screen.

### Backend
The backend requires the following environment variables to be set:
 - FLASK_APP=app.py
 - GB_DEBUG=true
 - GB_GITHUB_CLIENT_ID
 - GB_GITHUB_CLIENT_SECRET

You may wish to use https://github.com/pyenv/pyenv to manage your python versions. This project uses python 3.6. You might also want to use https://github.com/pyenv/pyenv-virtualenv to manage your python virtual environments.

`cd ./backend` and run `pip install -r requirements.txt` to install the backend's dependencies. To start the server, `flask run_connexion`.


## Using the app
Once you have both the backend and frontend running, you should be able to login using github. The app will be saving all state to local storage. You will make the app collaborative as shown in the gif by implementing the backend api and changing https://github.com/leroix/grocery-bliss/blob/master/frontend/src/Network.js to use your api.
