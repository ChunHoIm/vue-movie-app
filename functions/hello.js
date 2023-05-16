exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            name: "Lim JH",
            age: 110,
            email: "TEST@test.com"
        })
    }
}