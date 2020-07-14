const { searchWithStore } = require("./searchWithStore");
const { flexsearch, store } = require("./handler");
const { read_from_file } = require("./helper");

module.exports = {

    index: function (req, res, next) {
        res.json(flexsearch.info());

    },

    updateFromDisk: function (req, res, next) {
        read_from_file().then(() => {
            res.json(flexsearch.info());
        }).catch((err) => {
            next(err);
        });
    },

    search: async function (req, res, next) {
        const query = req.params.query || req.body;
        if (query) {
            try {
                res.json(await searchWithStore(flexsearch, store.store, query.query, query.category));
            }
            catch (err) {
                next(err);
            }
        }
        else {
            res.json([]);
        }
    }
}
