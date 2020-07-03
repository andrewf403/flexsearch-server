module.exports = {
    searchWithStore: async function (flexsearch, store, query, category) {
        const result = await flexsearch.search(query);
        const storedResult = store.filter(record => result.includes(record.id) &&
            (category !== undefined ? record.node.url.includes(category) : true)
              ? record
              : null).map(record => record.node);

        return storedResult;
    }
}