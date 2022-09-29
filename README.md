## Commands to run the project

* `npm install`, At the root `backend folder` and `frontend folder` install dependencies
* `npm start`, At the root `backend folder` will start the backend server at port `http://localhost:4000`
* `npm start`, At the root `frontend folder` will start the frontend app that servers at port `http://localhost:3000`

## Project

* This is a web system (frontend & backend) that completes the bubble popping game.
* The websocket server sends information about spawned bubbles, and await messages from the client when a bubble has been popped.

## Game rules

* Bubbles appears at random positions on screen
* Bubbles should stay alive for a random time period.
* If a bubble bursts (times out) before the player pops it, the game is over.
* Game score is the number of bubbles popped.