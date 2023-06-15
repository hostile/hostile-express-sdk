const express = require('express');

// route class to be impl under an api
class Route {

    enabled = true;

    parameters = [];

    handler;

    constructor(method, path) {
        this.method = method;
        this.path = path;
    }

    // abstract route test func
    test() { return true; }

    // define test func
    setTest(fn) { this.test = fn; }

    setParameters(params) {
        this.parameters = params;
    }

    setHandler(handler) {
        this.handler = handler;
    }

}

module.exports = Route;