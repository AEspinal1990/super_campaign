import {Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, JoinColumn, OneToOne, ManyToOne} from "typeorm";
import { Assignment } from "./Assignment";
import { CampaignManager } from "./CampaignManager";
import { Canvasser } from "./Canvasser";
import { Locations } from "./Locations";
import { Questionaire } from "./Questionaire";
import { TalkPoint } from "./TalkPoint";

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn({name: "ID"})
    private _ID!: number;
    @Column({name: "campaignName"})
    private _name!:string;
    @ManyToMany(type => CampaignManager, {cascade: true, eager: true})
    @JoinTable({name: "campaign_manager_mapping"})
    private _manager:CampaignManager[];
    @OneToOne(type => Assignment, {nullable: true})
    @JoinColumn()
    private _assignment!: Assignment;
    @ManyToMany(type => Locations, {eager: true, cascade: true})
    @JoinTable({name: "campaign_locations_mapping"})
    private _locations!:Locations[];
    @Column({name: "startDate"})
    private _startDate!:Date;
    @Column({name: "endDate"})
    private _endDate!:Date;
    @Column({name: "avgDuration"})
    private _avgDuration!:number;
    @OneToMany(type => Questionaire, qt => qt.campaignID)
    private _question!:Questionaire[];
    @OneToMany(type => TalkPoint, tp => tp.campaignID)
    private _talkingPoint!:TalkPoint[];

    public get ID():number {
        return this._ID;
    }
    public get name():string {
        return this._name;
    }
    public get manager():CampaignManager[] {
        return this._manager;
    }
    public get assignment():Assignment {
        return this._assignment;
    }
    public get locations():Locations[] {
        return this._locations;
    }
    public get startDate():Date {
        return this._startDate;
    }
    public get endDate():Date {
        return this._endDate;
    }
    public get avgDuration():number {
        return this._avgDuration;
    }
    public get question():Questionaire[]{
        return this._question;
    }
    public get talkingPoint():TalkPoint[]{
        return this._talkingPoint;
    }
    public set ID(ID:number){
        this._ID = ID;
    }
    public set name(name:string){
        this._name = name;
    }
    public set manager(value:CampaignManager[]){
        this._manager = value;
    }
    public set assignment(assignemnt:Assignment){
        this._assignment = assignemnt;
    }
    public set locations(locations:Locations[]){
        this._locations = locations;
    }
    public set startDate(startDate:Date){
        this._startDate = startDate;
    }
    public set endDate(endDate:Date){
        this._endDate = endDate;
    }
    public set avgDuration(avgDuration:number){
        this._avgDuration = avgDuration;
    }
    public set question(value:Questionaire[]){
        this._question = value;
    }
    public set talkingPoint(value:TalkPoint[]){
        this._talkingPoint = value;
    }

}