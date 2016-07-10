"use strict";

var objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

var errorHandlers = {}
// TODO: respond with 500 at database connection failures

// Format Mogoose errors
function createErrorMessage(err) {
    let message = "";
    let errors = err.errors;

    if (err.code === 11000) {
        message += "Field value must be unique. Another item has the same value for thit field."
    } else {
        for (var field in errors) {
            if (errors.hasOwnProperty(field)) {
                message += field + ": " + errors[field].message + ". ";
            }
        }
    }

   return message;
}

errorHandlers.error = function(res, err, message) {
    // 400 (Bad Request)
    var errorMessage = message + ". " + createErrorMessage(err);
    res.status(400).send(errorMessage);
    console.error("400 Bad Request:" + errorMessage);
}


errorHandlers.notFound = function(res, message) {
    // 404 (Not Found)
    res.status(404).send(message);
    console.warn("404 Not Found:" + message);
}

module.exports = errorHandlers;
