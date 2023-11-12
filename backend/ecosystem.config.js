module.exports = {
    apps: [
        {
            name: "scan-tx-backend",
            script: "npm",
            args: "start",
            watch: true,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
