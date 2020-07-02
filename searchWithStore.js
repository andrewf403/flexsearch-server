module.exports = {
    searchWithStore: async function (flexsearch, store, query) {
        const result = await flexsearch.search(query);
        const storedResult = store.filter(record => result.includes(record.id)).map(record => record.node);

        return storedResult;
    }
}