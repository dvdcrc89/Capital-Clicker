import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
export const Leaderboardhero = new Mongo.Collection("leaderboardhero");

if(Meteor.isServer){
    Meteor.publish('leaderboardhero',function (){

        return Leaderboardhero.find({});
    })
}

Meteor.methods({
    'leaderboardhero.insert'(points){
        if(!this.userId){
            throw new Meteor.Error('not-autorized');
        }
        Leaderboardhero.insert({
            userId:this.userId,
            userName:Meteor.user().emails[0].address,
            points: points
        })
    }
})