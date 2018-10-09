"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require("express");
// Import route hanlders
const adminRoutes = require("./routes/admin");
const app = express();
app.set('port', process.env.PORT || 3000);
/**
 * Primary app routes
 */
app.get('/', adminRoutes.home);
app.post('/adduser', adminRoutes.addUser);
exports.default = app;
//# sourceMappingURL=app.js.map