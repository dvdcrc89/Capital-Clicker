import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
export const Battle = new Mongo.Collection("battle");

if(Meteor.isServer){
    Meteor.publish('battle',function (){

        return Battle.find({});
    })
}

Meteor.methods({
    'battle.join'(){
        if(!this.userId){
            throw new Meteor.Error('not-autorized');
        }
        Battle.insert({
            _id:this.userId,
            userId:this.userId,
            userName:Meteor.user().emails[0].address,
            points: 0
        })
    },
    'battle.drop'(){
        Battle.find({userId: this.userId}).fetch().map((temp) => {
            Battle.remove({_id: temp._id})})
    },
    'battle.add'(points){
        Battle.update(this.userId,{$inc: {points:points}})
    }
})