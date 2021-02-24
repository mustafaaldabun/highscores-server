# Highscore server

This application provides a (very) simple backend REST server to track
highscores in a theoretical game.

All data is store in memory, nothing is persisted to disk.

Several hardcode usernames and passwords are included.

## Data model

Each user can submit multiple high scores. Each highscores entry is given a nickname
which is visible to all users.

All provided endpoints consume and produce json.

## Endpoints

Some of the provided endpoints are highlighted below.

Get the details of who is currently logged in:
```
GET /profile
```

Perform a login:
```
POST /login
{
    "username": "<username>",
    "password": "<password>"
}
```

Get the highscores:
```
GET /scores
```

Submit a new highscore:
```
POST /scores
{
    "nickname": "<nickname>",
    "score": <score>
}
```

## How to run

First, install packages  
> `npm install`

Then run the server  
> `npm run start`
