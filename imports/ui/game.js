import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
const shuffle = require('shuffle-array');

const questions = [{
    question: "Dog",
    answer: "Cane",
    wrong: "Gatto"
},{
    question: "Cat",
    answer: "Gatto",
    wrong: "Cane"
},{
    question: "Bird",
    answer: "Uccello",
    wrong: "Gatto"
},{
    question: "Red",
    answer: "Rosso",
    wrong: "Blue"
}];

let index = 0;


export default class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            current:questions[0],
            pointsPerClick:1,
            lifes: 4,
            points:0,
            state:0
        }
    }

    reset(){
        this.setState({
            current:questions[0],
            pointsPerClick:1,
            lifes: 4,
            points:0,
            state:1
        })
    }

    onLogout(){
        Accounts.logout();
    }

    getRight(){

        this.setState({
            current:shuffle.pick((questions),{picks:'1'}),
            points: this.state.points + this.state.pointsPerClick
        })
    }

    getWrong(){
        if (this.state.lifes===0){
            this.endGame();
        } else {
            this.setState({
                lifes: this.state.lifes - 1,
                current: shuffle.pick((questions), {picks: '1'}),

            })
        }
    }

    endGame(){
                this.setState({
                    state:2
                })
        }

    shoufflePicks(){

        const answersPicks = [{
                answer: <div className={"answer1"} key={"right"} onClick={this.getRight.bind(this)}><p>{this.state.current.answer}</p></div>
             },
            {
                answer:  <div className={"answer2"} key={"wrong"} onClick={this.getWrong.bind(this)}><p>{this.state.current.wrong}</p></div>
            }];

        shuffle(answersPicks);
        return (<div>
            {answersPicks[0].answer}
            {answersPicks[1].answer}
        </div>)
    }


    parseGame(){

        switch(this.state.state){
            case 0:
                    return(<button onClick={this.reset.bind(this)}>Start Game</button>)
            case 1:
                    return (<div>
                            <p>Points : {this.state.points}</p>
                            <p> Lifes: {this.state.lifes}</p>
                            <div className={"game"}>
                                <div className={"question"}><p>{this.state.current.question}</p></div>
                                {this.shoufflePicks()}
                            </div>
                            </div>)
             case 2:
                    return (<div>
                            <p> You Scored : {this.state.points}</p>
                             <button onClick={this.reset.bind(this)}>Start another Game</button>
                            </div>)
        }

    }
    render(){
        return(<div>
                    {this.parseGame()}
                    <button onClick={() => {
                        this.onLogout() }}>Logout
                    </button>
        </div>)
    }
}