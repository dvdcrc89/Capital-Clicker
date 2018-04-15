import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
export const Leaderboard = new Mongo.Collection("leaderboard");

if(Meteor.isServer){
    Meteor.publish('leaderboard',function (){

        return Leaderboard.find({});
    })
}

Meteor.methods({
    'leaderboard.insert'(points){
        if(!this.userId){
            throw new Meteor.Error('not-autorized');
        }
        Leaderboard.insert({
            userId:this.userId,
            userName:Meteor.user().emails[0].address,
            points: points
        })
    }
})