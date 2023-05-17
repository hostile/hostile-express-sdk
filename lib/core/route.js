const express = require('express');

// route class to be impl under an api
class Route {

    enabled = true;

    constructor(method, path, parameters, handler) {
        this.method = method;
        this.path = path;
        this.parameters = parameters;
        this.handler = handler;
    }

    // abstract route test func
    test() {}

}

module.exports = Route;