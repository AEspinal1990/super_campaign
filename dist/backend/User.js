"use strict";
class User {
    constructor(username, name, permission, employeeID) {
        this._username = username;
        this._name = name;
        this._permission = permission;
        this._employeeID = employeeID;
    }
    get username() {
        return this._username;
    }
    get name() {
        return this._name;
    }
    get permission() {
        return this._permission;
    }
    get employeeID() {
        return this._employeeID;
    }
    set username(value) {
        this._username = value;
    }
    set name(value) {
        this._name = value;
    }
    set permission(value) {
        this._permission = value;
    }
    set employeeID(value) {
        this._employeeID = value;
    }
}
//# sourceMappingURL=User.js.map