var Alexa = require('alexa-sdk');
var request = require('request');
const skillName = "Skill Nane";

var handlers = {

    "ChooseSail": function () {




    },

    "AboutIntent": function () {
        var speechOutput = "Head Sail Chooser is by Conner Fullerton";
        this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    },

    "AMAZON.HelpIntent": function () {
        var speechOutput = "";
        speechOutput += "Here are some things you can say: ";
        speechOutput += "what sail should I use for my J24";
        speechOutput += "what sail should I use while sailing Upwind on my J30";
        speechOutput += "You can also say stop if you're done. ";
        speechOutput += "So how can I help?";
        this.emit(':ask', speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "AMAZON.CancelIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "LaunchRequest": function () {
        var speechText = "";
        speechText += "Welcome to " + skillName + ".  ";
        speechText += "You can ask a question like, what sail should I use while sailing Upwind on my J30.  ";
        var repromptText = "For instructions on what you can say, please say help me.";
        this.emit(':ask', speechText, repromptText);

    }

};


exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "app-ID";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
