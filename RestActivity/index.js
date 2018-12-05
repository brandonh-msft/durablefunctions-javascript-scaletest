const request = require("request");
module.exports = async function (context) {
    context.log(`Running RestActivity at ${context.bindings.input.url} ...`);
    var resp = await new Promise((resolve, reject) => {
        request(context.bindings.input.url, (err, resp, body) => {
            if (err) reject(err);
            else if (body.error) reject(body.error);
            else if (body.response
                && body.response.error) reject(body.response.error);

            resolve(resp);
        });
    });

    return resp;
};