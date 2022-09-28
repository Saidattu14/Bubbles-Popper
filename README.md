## Commands to run the project

* `npm install`, At the root `backend folder` and `frontend folder` install dependencies
* `npm start`, At the root `backend folder` will start the backend server at port `http://localhost:4000`
* `npm start`, At the root `frontend folder` will start the frontend app that servers at port `http://localhost:3000`

## Project

* This is a web system (frontend & backend) that completes the bubble popping game.
* The websocket server sends information about spawned bubbles, and await messages from the client when a bubble has been popped.

## Game rules

* Bubbles should appear at random positions on screen
* The time interval between bubble spawns should change, start out slow and go faster and faster. Adding a random element is appreciated
* Bubbles should stay alive for a random time period, use your judgement for setting the limits to make the game challenging and fair.
* Multiple bubbles are allowed on the screen at the same time.
* If a bubble bursts (times out) before the player pops it, the game is over.
* Game score is the number of bubbles popped.