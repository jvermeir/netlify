exports.handler = async function(event, context) {
    console.log("hallo");
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World - v3"})
    };
}
