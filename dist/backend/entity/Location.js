"use strict";
class Locations {
    constructor(ID, num, street, unit, city, state, zipcode) {
        this._ID = ID;
        this._streetNumber = num;
        this._street = street;
        this._unit = unit;
        this._city = city;
        this._state = state;
        this._zipcode = zipcode;
    }
    get ID() {
        return this._ID;
    }
    get number() {
        return this._streetNumber;
    }
    get street() {
        return this._street;
    }
    get unit() {
        return this._unit;
    }
    get city() {
        return this._city;
    }
    get state() {
        return this._state;
    }
    get zipcode() {
        return this._zipcode;
    }
    set ID(value) {
        this._ID = value;
    }
    set streetNumber(value) {
        this._streetNumber = value;
    }
    set street(value) {
        this._street = value;
    }
    set unit(value) {
        this._unit = value;
    }
    set city(value) {
        this._city = value;
    }
    set state(value) {
        this._state = value;
    }
    set zipcode(value) {
        this._zipcode = value;
    }
}
//# sourceMappingURL=Location.js.map