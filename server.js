let express = require('express');
let cookieParser = require('cookie-parser');
let cors = require('cors');

// -------------------------------------------------
// demo users
let userPasswords = {
    'chidi': 'anagonye',
    'eleanor': 'shellstrop',
    'jason': 'mendoza',
    'tahani': 'al-jamil'
}

// -------------------------------------------------
// state data

// session tokens are valid until the server restarts
let sessions = {};

let scores = [
    {rank: 1, username: "chidi", nickname: "T.M. Scanlon", score: 1000},
    {rank: 2, username: "tahani", nickname: "Princess Stephanie", score: 900},
    {rank: 3, username: "eleanor", nickname: "Legit Snack", score: 800},
    {rank: 4, username: "jason", nickname: "Jake Luton", score: 700},
];

// -------------------------------------------------
// middleware

let app = express();
app.use(cors({
    origin: 'http://localhost:5000'
}));
app.use(cookieParser());
app.use(express.json());

app.use(function (req, res, next) {
    if (req.path !== '/login') {

        let session = req.cookies['session'];
        let username = sessions[session];

        if (username === undefined) {
            res.status(401);
            res.send({"error": "Not authenticated"});
            return;
        }
        req.username = username;
    }

    next();
});

// -------------------------------------------------
// endpoints

app.post('/login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    let expectedPwd = userPasswords[username];
    if (expectedPwd === undefined || expectedPwd !== password) {
        res.status(401).send({"error": "Login Failed"});
        return;
    }

    let session = Math.random().toString(16).substr(2, 8);
    sessions[session] = username;
    res.cookie('session', session).send();
});

app.post('/logout', function (req, res) {
    sessions[req.cookies['session']] = undefined;
    res.clearCookie('session');
    res.send();
});

app.get('/profile', function (req, res) {
    res.send({"username": req.username});
});

app.get('/scores', function (req, res) {
    let onlyMine = req.query['onlymine'];

    let results = onlyMine !== undefined && onlyMine !== false
        ? scores.filter(s => s.username === req.username)
        : scores;

    // hide username
    results = results.map(function (s) {
        return {
            nickname: s.nickname,
            score: s.score,
            rank: s.rank
        }
    });

    res.send({"scores": results});
});

app.post('/scores', function (req, res) {
    if (typeof req.body.score !== 'number') {
        res.status(400).send({"error": "Score must be a number"});
        return;
    }

    let scoreItem = {
        username: req.username,
        nickname: req.body.nickname,
        score: req.body.score
    };

    scores.push(scoreItem);
    scores = scores.sort((a, b) => b.score - a.score);
    scores.forEach((s, idx) => {
        s.rank = idx+1;
    })

    res.status(204).send();
});


// -------------------------------------------------
// startup
let server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Highscore server running on ${host}:${port}`);
});