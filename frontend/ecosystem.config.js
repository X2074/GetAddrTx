module.exports = {
    apps: [
        {
            name: "get-address-tx",
            script: "npm",
            args: "start",
            watch: true,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
