import  {Meteor} from "meteor/meteor";
import React from "react";
import ReactDOM from "react-dom";
import {AppRouter,history,onAuthChange} from "../imports/routes/appRouter";
import {Tracker} from "meteor/tracker";
import './../imports/startup/simple_schema_configuration';

Tracker.autorun(()=> {
    onAuthChange();

});

Meteor.startup(()=> {

    ReactDOM.render(<AppRouter/>,document.getElementById("app"));
})
