const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);

    const tasks = [];
    for (var i = 0; i < req.params.instances; i++) {
        tasks.push(client.startNew(req.params.functionName));
    }

    const instanceIds = await Promise.all(tasks);

    return instanceIds;
};