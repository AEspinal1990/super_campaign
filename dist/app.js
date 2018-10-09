"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const statusController = require("./controllers/status");
require("reflect-metadata");
const app = express();
app.set('port', process.env.PORT || 3000);
app.get('/', statusController.hi);
exports.default = app;
//# sourceMappingURL=app.js.map