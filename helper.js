const env = require("./env");
const defaults = require("./config/default");
const { readFile, exists, existsSync } = require("fs");
const { resolve } = require("path");
const filename = "./public/flex-server.json";


let config_env;

const config = (function () {
    if (existsSync("../../package.json")) {
        const config_package = require("../../package.json");
        if (config_package.flexsearch) {
            if ((config_package.flexsearch === "development") || (config_package.flexsearch === "production")) {
                config_env = require("./config/" + config_package.flexsearch);
            }
            else {
                if (config_package.development || config_package.production) {
                    if (config_package[env] && (config_package[env].indexOf(".json") !== -1) && existsSync("../../" + config_package[env])) {
                        config_env = require("../../" + config_package[env]);
                    }
                }
                else {
                    config_env = config_package.flexsearch;
                }
            }
        }
    }

    if (!config_env && existsSync("../../flexsearch.json")) {
        config_env = require("../../flexsearch.json");
    }
    if (!config_env) {
        config_env = require("./config/" + env);
    }

    [
        "debug",
        "port",
        "port_ssl",
        "force_ssl",
        "https",
        "compress",
        "autosave",
        "worker"
    ].forEach(function (flag) {
        const env_var = global.process.env[flag.toUpperCase()];
        defaults[flag] = (
            typeof env_var === "undefined" ?
                config_env.server[flag]
                :
                env_var
        );
    });

    [
        "async",
        "cache",
        "threshold",
        "depth",
        "limit",
        "encode",
        "tokenize",
        "filter",
        "stemmer"
        //"worker"
    ].forEach(function (flag) {
        const env_var = global.process.env[flag.toUpperCase()];
        defaults[flag] = (
            typeof env_var === "undefined" ?
                config_env.client[flag]
                :
                env_var
        );
    });
    return defaults;
})();

let flexsearch;
let store;

module.exports = {
    config: config,
    init: function (_flexsearch, _store) {
        flexsearch = _flexsearch;
        store = _store;
    },

    read_from_file: function () {
        return new Promise((resolve, reject) => {
            exists(filename, function (exists) {
                if (exists) {
                    readFile(filename, function (err, data) {
                        if (err) {
                            reject(err);
                            throw err;
                        }
                        if (data && data.length) {
                            const jsonData = JSON.parse(data);
                            try {
                                flexsearch.import(jsonData.index);
                                store.store = jsonData.store;
                                if (config.debug) {
                                    console.info("Data was loaded successfully.");
                                }
                                resolve();
                            }
                            catch (err) {
                                reject(err);
                                throw err;
                            }
                        }
                    });
                } else {
                    reject(new Error("File not found"));
                }
            });
        });
    },
};
