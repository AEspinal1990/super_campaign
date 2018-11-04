import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, JoinColumn, OneToOne, ManyToOne } from "typeorm";
import { Assignment } from "./Assignment";
import { CampaignManager } from "./CampaignManager";
import { Locations } from "./Locations";
import { Questionaire } from "./Questionaire";
import { TalkPoint } from "./TalkPoint";
import { Results } from "./Results";

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn({ name: "ID" })
    private _ID!: number;
    @Column({ name: "campaignName" })
    private _name!: string;
    @ManyToMany(type => CampaignManager, { cascade: true, eager: true })
    @JoinTable({ name: "campaign_manager_mapping" })
    private _managers: CampaignManager[];
    @OneToOne(type => Assignment, { nullable: true })
    @JoinColumn()
    private _assignment!: Assignment;
    @ManyToMany(type => Locations, { eager: true, cascade: true })
    @JoinTable({ name: "campaign_locations_mapping" })
    private _locations!: Locations[];
    @Column({ name: "startDate" })
    private _startDate!: Date;
    @Column({ name: "endDate" })
    private _endDate!: Date;
    @Column({ name: "avgDuration" })
    private _avgDuration!: number;
    @OneToMany(type => Questionaire, qt => qt.campaign, { cascade: true })
    private _question!: Questionaire[];
    @OneToMany(type => TalkPoint, tp => tp.campaign, { cascade: true })
    private _talkingPoint!: TalkPoint[];
    @OneToMany(type => Results, res => res.campaign, { nullable: true })
    private _results!: Results[];
    public get results(): Results[] {
        return this._results;
    }
    public set results(value: Results[]) {
        this._results = value;
    }

    public get ID(): number {
        return this._ID;
    }
    public get name(): string {
        return this._name;
    }
    public get managers(): CampaignManager[] {
        return this._managers;
    }
    public get assignment(): Assignment {
        return this._assignment;
    }
    public get locations(): Locations[] {
        return this._locations;
    }
    public get startDate(): Date {
        return this._startDate;
    }
    public get endDate(): Date {
        return this._endDate;
    }
    public get avgDuration(): number {
        return this._avgDuration;
    }
    public get question(): Questionaire[] {
        return this._question;
    }
    public get talkingPoint(): TalkPoint[] {
        return this._talkingPoint;
    }
    public set ID(ID: number) {
        this._ID = ID;
    }
    public set name(name: string) {
        this._name = name;
    }
    public set managers(value: CampaignManager[]) {
        this._managers = value;
    }
    public set assignment(assignemnt: Assignment) {
        this._assignment = assignemnt;
    }
    public set locations(locations: Locations[]) {
        this._locations = locations;
    }
    public set startDate(startDate: Date) {
        this._startDate = startDate;
    }
    public set endDate(endDate: Date) {
        this._endDate = endDate;
    }
    public set avgDuration(avgDuration: number) {
        this._avgDuration = avgDuration;
    }
    public set question(value: Questionaire[]) {
        this._question = value;
    }
    public set talkingPoint(value: TalkPoint[]) {
        this._talkingPoint = value;
    }

    public getLocationsResults() {
        var completedLocations = [];

        if (this._results.length > 0) {
            for (let i in this._results) {
                if (completedLocations.length === 0) {
                    completedLocations.push({
                        completedLocation: this._results[i].completedLocation,
                        results: [{
                            resultNum: this._results[i].answerNumber,
                            result: this._results[i].answer
                        }],
                        rating: this._results[i].rating,
                        //K:
                        coord: { lat: parseFloat(this._results[i].completedLocation.locations[0].lat.toString()), lng: parseFloat(this._results[i].completedLocation.locations[0].long.toString()) }
                    });
                } else {
                    completedLocations = this.addResult(completedLocations, this._results[i]);
                }
            }
        }

        return completedLocations;
    }

    public addResult(completedLocations, result){
        var results = completedLocations;
        for (let j in results) {
            if (result.completedLocation.ID === results[j].completedLocation.ID) {
                results[j].results.push({
                    resultNum: result.answerNumber,
                    result: result.answer
                });
            } else if (Number(j) === results.length-1) {
                results.push({
                    completedLocation: result.completedLocation,
                    results: [{
                        resultNum: result.answerNumber,
                        result: result.answer
                    }],
                    rating: result.rating
                });
            }
        }

        return results;
    }

}