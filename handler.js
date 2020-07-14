const { config, init, read_from_file } = require("./helper");

const flexsearch = require("flexsearch").create(config ? config.preset || {

    async: true,
    cache: config.cache,
    threshold: config.threshold,
    depth: config.depth,
    limit: config.limit,
    encode: config.encode,
    tokenize: config.tokenize,
    filter: config.filter,
    stemmer: config.stemmer

} : null);

let store = {
    store: []
};

init(flexsearch, store);

read_from_file().catch(err => console.error(err.toString()));

module.exports = {

    flexsearch: flexsearch,
    store: store,
};