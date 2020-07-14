const env = require("./env");
const { config } = require("./helper");
const express = require("express");
const app = express();
const controller = require("./controller");
const compression = require("compression");
const { json } = require("body-parser");

app.disable("x-powered-by");

/* Enforce SSL
-----------------------------------------------*/

if (config.force_ssl) {

    app.use(function (req, res, next) {

        if (req.secure ||
            (req.protocol === "https") ||
            (req.get("x-forwarded-proto") === "https")) {

            next();
        }
        else {

            res.redirect("https://" + req.headers.host + req.url);
        }
    });
}

/* Compression
-----------------------------------------------*/

app.use(compression({

    filter: function (req, res) {

        return req.headers["x-no-compression"] ?

            false
            :
            compression.filter(req, res);
    }
}));

/* CORS
-----------------------------------------------*/

app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //req.env = env;

    next();
});

/* Body Parser
-----------------------------------------------*/

app.use(json());

/* Routes
-----------------------------------------------*/

app.get("/api/v1/search-dev-info", controller.index);
app.get("/api/v1/rereadindex", controller.updateFromDisk);
app.post("/api/v1/search", controller.search);

app.use(express.static('public'));

console.info("\x1b[32m\x1b[1m",

    "\n" +
    "  _     _              _        _   _               ____                 \n" +
    " | |   (_)_   _____   / \\   ___| |_(_) ___  _ __   |  _ \\  ___   ___ ___ \n" +
    " | |   | \\ \\ / / _ \\ / _ \\ / __| __| |/ _ \\| '_ \\  | | | |/ _ \\ / __/ __|\n" +
    " | |___| |\\ V /  __// ___ \\ (__| |_| | (_) | | | | | |_| | (_) | (__\\__ \\\n" +
    " |_____|_| \\_/ \\___/_/   \\_\\___|\\__|_|\\___/|_| |_| |____/ \\___/ \\___|___/\n" +
    " __      _(_) |_| |__                                                    \n" +
    " \\ \\ /\\ / / | __| '_ \\                                                   \n" +
    "  \\ V  V /| | |_| | | |                                                  \n" +
    "  _\\_/\\_/ |_|\\__|_| |_|__                      _        _                \n" +
    " |  ___| | _____  __/ ___|  ___  __ _ _ __ ___| |__    (_)___            \n" +
    " | |_  | |/ _ \\ \\/ /\\___ \\ / _ \\/ _` | '__/ __| '_ \\   | / __|           \n" +
    " |  _| | |  __/>  <  ___) |  __/ (_| | | | (__| | | |_ | \\__ \\           \n" +
    " |_|   |_|\\___/_/\\_\\|____/ \\___|\\__,_|_|  \\___|_| |_(_)/ |___/           \n" +
    "                                                     |__/              \n" +
    "Version: " + require("./package.json").version + "\n" +
    "-------------------------------------------------------------", "\x1b[0m"
);

/* Start HTTPS Server
-----------------------------------------------*/

if (config.https || config.force_ssl) {

    const { readFileSync, existsSync } = require("fs");

    if (existsSync("../../cert/" + env + ".pem") && existsSync("../../cert/" + env + ".crt")) {

        const { createServer } = require("https");

        createServer({

            key: readFileSync("../../cert/" + env + ".pem", "utf8"),
            cert: readFileSync("../../cert/" + env + ".crt", "utf8")

        }, app).listen(config.port_ssl, function (err) {

            if (err) throw err;

            console.info("Server@" + process.pid + " listening on https://localhost" + (config.port_ssl !== 443 ? ":" + config.port_ssl : ""));
        });
    }
    else {

        console.info("Could not find certificates located at: /certs. Therefore HTTPS server can't initialize.");
    }
}

/* Start HTTP Server
-----------------------------------------------*/

if (!config.force_ssl) {

    const server = app.listen(config.port, function (err) {

        if (err) throw err;

        console.info("Server@" + process.pid + " listening on http://localhost" + (config.port !== 80 ? ":" + config.port : ""));
    });

    if (process.env.NODE_ENV === "test") {

        module.exports = server;
    }
}
