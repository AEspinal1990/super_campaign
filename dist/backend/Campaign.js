"use strict";
class Campaign {
    constructor(ID, name, managers, canvassers, assignment, locations, startDate, endDate, avgDuration, questionaire, talkingPoints) {
        this._ID = ID;
        this._name = name;
        this._managers = managers;
        this._canvassers = canvassers;
        this._assignment = assignment;
        this._locations = locations;
        this._startDate = startDate;
        this._endDate = endDate;
        this._avgDuration = avgDuration;
        this._questionaire = questionaire;
        this._talkingPoints = talkingPoints;
    }
    get ID() {
        return this._ID;
    }
    get name() {
        return this._name;
    }
    get managers() {
        return this._managers;
    }
    get canvassers() {
        return this._canvassers;
    }
    get assignment() {
        return this._assignment;
    }
    get locations() {
        return this._locations;
    }
    get startDate() {
        return this._startDate;
    }
    get EndDate() {
        return this._endDate;
    }
    get avgDuration() {
        return this._avgDuration;
    }
    get questionaire() {
        return this._questionaire;
    }
    get talkingPoints() {
        return this._talkingPoints;
    }
    set ID(ID) {
        this._ID = ID;
    }
    set name(name) {
        this._name = name;
    }
    set managers(managers) {
        this._managers = managers;
    }
    set canvassers(canvassers) {
        this._canvassers = canvassers;
    }
    set assignment(assignemnt) {
        this._assignment = assignemnt;
    }
    set locations(locations) {
        this._locations = locations;
    }
    set startDate(startDate) {
        this._startDate = startDate;
    }
    set endDate(endDate) {
        this._endDate = endDate;
    }
    set avgDuration(avgDuration) {
        this._avgDuration = avgDuration;
    }
    set questionaire(questionaire) {
        this._questionaire = questionaire;
    }
    set talkingPoints(talkingPoints) {
        this._talkingPoints = talkingPoints;
    }
}
//# sourceMappingURL=Campaign.js.map