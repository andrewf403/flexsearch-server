module.exports = {
    apps: [
        {
            name: "docserver",
            script: "./server.js",
            watch: false,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
