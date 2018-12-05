const df = require("durable-functions");
const testUrl = "https://xtension01.azurewebsites.net/api/Increment01?input=1";
const numParallelExecutions = 100;

module.exports = df.orchestrator(function* (context) {
    const result = [];

    const parallelExecutions = [];
    for (var i = 0; i < numParallelExecutions; i++) {
        context.log(`Queueing RestActivity #${i}...`);
        parallelExecutions.push(context.df.callActivity("RestActivity", { url: testUrl }));
    }

    context.log('waiting for activities to complete...');
    const executionResults = yield context.df.Task.all(parallelExecutions);
    context.log('completed.');

    context.log('adding responses to result');
    for (var i = 0; i < executionResults.length; i++) {
        result.push({ key: i, value: executionResults[i].statusCode });
    }

    context.df.setCustomStatus("Success");

    context.log('returning...');
    context.log(result);
    return result;
});