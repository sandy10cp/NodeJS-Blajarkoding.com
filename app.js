const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

// konfigurasi koneksi
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blajarcoding'
})

conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql connected...');
})

app.use(require("express-session")({
    secret: "The milk would do that",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets', express.static(__dirname + '/public'));

// Set sessin to cookie
app.use(session({ secret: 'ssshhhhh' }));

//route untuk login
app.get('/login', (req, res) => {
    res.render('login');
});

//route untuk submit login
let sess;
app.post('/login', (req, res) => {
    let data = { username: req.body.username, password: req.body.password };
    let sql = "SELECT * FROM users WHERE username='" + data.username + "' And password='" + data.password + "'";
    let query = conn.query(sql, (err, results) => {
        if (results.length != 0) {
            sess = req.session;
            sess.nama = results[0].nama;
            res.redirect('create-tutorial');
        } else {
            res.render('login', {
                message: { error: true, content: 'Username Password tidak cocok !' },
            })
        }
    });
});

// route untuk logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });

});

//route untuk homepage
app.get('/create-tutorial', (req, res) => {
    sess = req.session;
    if (sess.nama) {
        res.render('create-tutorial', {
            nama: sess.nama,
        })
    } else {
        res.render('login', {
            message: { error: true, content: 'Login dulu !' },
        })
    }
});

//route untuk posting tutorial
app.post('/save-posting', (req, res) => {
    let r = req.body;
    let data = { title: r.title, content: r.content, tanggal: r.tanggal, categori: r.categori, status: 'show' };
    let sql = "INSERT INTO content set ?";
    let query = conn.query(sql, data, (err, results) => {
        if (err) {
            res.json({ data: { STATUS: 'gagal' } })
            console.log(err);
        } else {
            res.json({ data: { STATUS: 'berhasil' } })
        }
    });
})

// // route untuk tampilan index
app.get('/', (req, res) => {
    let sql = "SELECT * FROM content";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', {
            results: results,
        })
    })
});

// // route untuk tampilan tutorial by web
app.get('/web', (req, res) => {
    let sql = "SELECT * FROM content WHERE categori='WEB'";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', {
            results: results,
        })
    })
});

// // route untuk tampilan tutorial by mobile
app.get('/mobile', (req, res) => {
    let sql = "SELECT * FROM content WHERE categori='MOBILE'";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', {
            results: results,
        })
    })
});

//route untuk tampilan portfolio
app.get('/sandywajongkere', (req, res) => {
    res.render('portfolio')
});

//route untuk tampilan portfolio
app.get('/detail-tutorial', (req, res) => {
    const r = req.query.id;
    let sql = "SELECT * FROM content WHERE ID=" + r;
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('detail-tutorial', {
            results: results,
        },
            function (err, html) {
                // Here you have access to the generated HTML
                res.send(html)
            })
        //res.json(results)
    })
});





//route untuk error url
app.use('*', function (req, res) {
    res.render('error');
});

const PORT = process.env.PORT | 8000;
//create port
app.listen(PORT, () => {
    console.log(`Server running at port http://localhost:${PORT}`);
});