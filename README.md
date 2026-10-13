# odin-waldo-backend
The Odin Project Where's Waldo Project Backend

Messy plan of working on this project: 

Frontend: 
Provide start splash screen with play button or something. Require players to enter their name.
Have selection of different pictures user can choose from.
Loads Picture and based on picture id (i guess), get number of characters and their names from backend. do not sent coordinates as well.
Once picture has loaded, send request to backend to start timer.
Lets users click on a place in a picture, and select a character name. 
send coordinate and nameId to backend
Provide feedback if incorrect or keep selection if correct (with name, LOCK IN)

Repeat with less names to select from. 
When finished, send request to stop timer, get time, and log their time and name to the backend ranking for that picture.
Offer to repeat same or back to start. 

Backend: 
When app requests game through a picture Id, sign JWT with start timer, username and empty move list, 
Evaluate every move and update the JWT accordingly. If the game is over, save data to the database. 

JWT:
When the player starts a game, server signs a JWT to the player. this JWT contains the game state, like so:

{
startTime: timestamp of starting time,
username: string,
gameId: (which game the user is playing)
correctMoves: { dictionary of id of correct moves }
}

only if the server determines that the player has successfully finished the game, will the time be calculated and the result recorded in the database. 

the database only needs to know: gameId (which game was the user playing), username, time
