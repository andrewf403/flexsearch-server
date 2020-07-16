module.exports = {
    searchWithStore: async function (flexsearch, store, query, category) {
        const result = await flexsearch.search(query);
        return store.filter(record => result.includes(record.id) &&
        (category !== undefined ? record.node.url.includes(category) : true)
            ? record
            : null).map(record => {
            record.node.excerpt = getSnippet(record.node.content, query.query)
            return record.node
        });
    }
}

// escape user input for possible regex characters
const escapeRegExp = (str = '') => str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');

// combine multiple query words
const combineQuery = (str = '') =>
    escapeRegExp(str.trim())
        .replace(/\s{2,}/g, ' ')
        .split(' ')
        .join('|');

const getSnippet = (text, search) => {
    const query = combineQuery(search)
    const matchRe = new RegExp(`(\\b.{0,50}\\b)(${query})(\\b.{0,50}\\b)`, 'gmi')
    const highlightRe = new RegExp(`\\b(${query})\\b`, 'gi')

    const match = text.match(matchRe)
    if (match !== null && match.length > 0) {
        text = match.map((m) => m.trim()).join('&hellip; ')
    }

    return (text.substr(0, 300).trim() + '&hellip;').replace(highlightRe, '<mark>$1</mark>');
}
