import React from "react";
import Signup from "./signup";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";
import {history} from "../routes/appRouter";
import ReactPlayer from 'react-player';
import {capitals} from './capital'
import {country} from "./country";
const shuffle = require('shuffle-array');
let audio = new Audio('soundtrack.mp3');
let keeper=[]

const questions = capitals.map((cap) =>{

    let wrong = shuffle(capitals)[0].city;
    while(cap.city==wrong) wrong = shuffle(capitals)[0].city;
    let country_flag=undefined;
    for(key in country){
        if (country[key].country===cap.country) {
            country_flag = "./../flags/"+country[key].flag.toLowerCase()+".png";


        }

    }
    return ({
        question: cap.country,
        answer: cap.city,
        wrong: wrong,
        flag: country_flag

    })

})


export default class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            current:shuffle(questions)[0],
            pointsPerClick:1,
            lifes: 4,
            points:0,
            state:0,
            message:null,
            upgrade:0
        }
    }

    componentDidMount() {
        audio.play();
    }
    componentWillUnmount() {
        audio.pause();
    }
    reset(){

        this.setState({
            current:shuffle(questions)[0],
            pointsPerClick:1,
            lifes: 4,
            points:0,
            state:1,
            upgrade:0

        })
    }

    onLogout(){
        Accounts.logout();
    }

    getRight(){
        let audio = new Audio('right.mp3');
        audio.volume=0.7;
        audio.play();
        this.setState({
            current:shuffle.pick((questions),{picks:'1'}),
            points: this.state.points + this.state.pointsPerClick,
            message: "Well done! The capital of " + this.state.current.question +" is "+ this.state.current.answer,
            upgrade:0

        })
    }

    getWrong(){
        let audio = new Audio('wrong.mp3');
        audio.volume=0.5;
        audio.play();
        if (this.state.lifes===0){
            this.endGame();
        } else {
            this.setState({
                lifes: this.state.lifes - 1,
                current: shuffle.pick((questions), {picks: '1'}),
                message: "You have got it wrong this time, The capital of " + this.state.current.question +" is "+ this.state.current.answer,
                upgrade:0



            })
        }
    }

    endGame(){
                Meteor.call("leaderboard.insert",this.state.points);
                this.setState({
                    state:2
                })
        }

    shoufflePicks(){

        let answersPicks = [{
            answer: <div className={"answer1-battle"} key={"right"} onClick={this.getRight.bind(this)}><p className={"word"}>{this.state.current.answer}</p></div>
        },
            {
                answer:  <div className={"answer1-battle"} key={"wrong"} onClick={this.getWrong.bind(this)}><p className={"word"}>{this.state.current.wrong}</p></div>
            }];150

        if(this.state.upgrade<1) keeper=shuffle(answersPicks);
            else answersPicks=keeper
        return (
            <div className={"game"}>
                <div className={"question"}>
                    <div className={"flag"}>
                        <img src={this.state.current.flag} />
                        <p className={"centered"}> {this.state.current.question}</p>
                    </div>
                </div>
                <div className={"answers"}>
                    {answersPicks[0].answer}
                    {answersPicks[1].answer}
                </div>

            </div>)
    }



    buyUpgrade() {


        const plus5 = <div className={"up"} onClick={()=>{
            this.setState({
            points:this.state.points -10,
            pointsPerClick: this.state.pointsPerClick+5,
            upgrade:1

        })}}>
        <img src={"./../img/compass1"}></img><p>POINTS PER CLICK <bold>+5</bold></p><p className={"red"}> (10 points)</p></div>

        const plus100 = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -100,
                pointsPerClick: this.state.pointsPerClick+50,
                upgrade:1
            })}}>
            <img src={"./../img/map2"}></img><p>POINTS PER CLICK <bold>+50</bold></p><p className={"red"}>(100 points)</p></div>

        const life = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -500,
                lifes: this.state.lifes+1,
                upgrade:1
            })}}>
            <img src={"./../img/energy"}></img><p>ADD <bold>1</bold> LIFE</p> <p className={"red"}>(500 points)</p> </div>

        const plus25 = <div className={"up"} onClick={()=>{
            this.setState({
                points:this.state.points -50,
                pointsPerClick: this.state.pointsPerClick+25,
                upgrade:1
            })}}>
            <img src={"./../img/ball"}></img><p>POINTS PER CLICK <bold>+25</bold></p><p className={"red"}> (50 points)</p></div>

        const upgrade = [];
        if (this.state.points>=10) upgrade.push(plus5);

        if (this.state.points>=50) upgrade.push(plus25);

        if (this.state.points>=100) upgrade.push(plus100);


        if (this.state.points>=500) upgrade.push(life);


        return ( <div className={"upgrade"}>{upgrade}</div>)


    }

    renderMenu(){
        return (
            <div>
                <h1 className="animate three title">
                    <span>C</span><span>a</span><span>p</span><span>i</span><span>t</span><span>a</span><span>l</span> &nbsp;
                    <span>C</span><span>l</span><span>i</span><span>c</span><span>k</span><span>e</span><span>r</span></h1>
            <div className={"menu"}>

            <h1> Game Menu</h1>

            <div className={"menu-odd"} onClick={this.reset.bind(this)}>Start Game</div>
            <div className={"menu-even"} onClick={()=>history.push('/leaderboard')}>Leaderboard</div>
            <div className={"menu-odd"} onClick={()=>history.push('/battle')}>Multy-Players Battle</div>
            <div className={"menu-even"} onClick={()=>history.push('/halloffame')}>Hall of Fame</div>
            <div className={"menu-odd"} onClick={this.onLogout.bind(this)}>Logout</div>
        </div>
            </div>)
    }

    lifes(){
        const lifes=[];
        for(i=0;i<this.state.lifes;i++){
            lifes.push(<img className={"life"}  src={"./../img/life.png"}/>)
        }

        if(lifes.length>0){
            return (
            <div className={"lifes"}>
                {lifes}
            </div>)}
            else return <img className={"life"}  src={"./../img/danger.png"}/>
    }

    parseGame(){

        switch(this.state.state){
            case 0:
                    return (this.renderMenu())
            case 1:
                    return (
                        <div className={"fullScreen"}>
                        <div className={"canvas"}>

                            <div className={"stats"}>
                                <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>this.setState({state:0})}/>

                                    {/*<p> Lifes: {this.state.lifes}</p>*/}
                                    </div>

                                {this.shoufflePicks()}
                                <div className={"footerGame"}>
                                    <p>   {this.state.message}</p>
                                </div>
                         </div>
                            <div className={"upgradeSection"}>
                                {this.lifes()}

                                <h1>{this.state.points} <img className={"star"}  src={"./../img/star.png"}/></h1>
                                <h1>{this.state.pointsPerClick}  <img className={"star"}  src={"./../img/star.png"}/> per <img className={"life"}  src={"./../img/click.png"}/></h1>

                                <h1>Upgrades</h1>
                                {this.buyUpgrade()}
                            </div>
                        </div>
                                )
             case 2:
                    return (
                        <div className={"wrapper"}>
                        <div className={"endedGame"}>
                            <img className={"back"}  src={"./../img/back1.svg"} onClick={()=>this.setState({state:0})}/>

                            <h1>Congratulation! You Scored {this.state.points} Points</h1>
                            </div>
                        </div>)
        }

    }


    render(){
        return(<div className={"wrapper"}>
                    {this.parseGame()}
        </div>)
    }
}