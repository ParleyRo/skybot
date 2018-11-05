const { ActivityTypes } = require('botbuilder');

// Turn counter property
const TURN_COUNTER_PROPERTY = 'turnCounterProperty';
const WELCOMED_USER = 'DidBotWelcomeUser';

class EchoBot {

    constructor(conversationState) {
        // Creates a new state accessor property.
        // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors
        this.countProperty = conversationState.createProperty(TURN_COUNTER_PROPERTY);
        this.conversationState = conversationState;

        this.welcomedUserPropery = conversationState.createProperty(WELCOMED_USER);
    }

    async onTurn(turnContext)
    {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) 
        {
            // Read UserState. If the 'DidBotWelcomeUser' does not exist (first time ever for a user)
            // set the default to false.
            let didBotWelcomeUser = await this.welcomedUserPropery.get(turnContext, false);

            // Your bot should proactively send a welcome message to a personal chat the first time
            // (and only the first time) a user initiates a personal chat with your bot.
            if (didBotWelcomeUser === false) 
            {
                // The channel should send the user name in the 'From' object
                let userName = turnContext.activity.from.name;

                // This example hardcodes specific uterances. You should use LUIS or QnA for more advance language understanding.
                let text = turnContext.activity.text.toLowerCase();
                let greatingWords = ['hi','hello','what\'s up','wassup','sup','hey','greatings'];

                if (greatingWords.indexOf(text) > -1){
                    await turnContext.sendActivity(`Hello to you too, ${userName} !`);
                    // Set the flag indicating the bot handled the user's first message.
                    await this.welcomedUserPropery.set(turnContext, true);
                }else{
                    await turnContext.sendActivity('You must greating me!');
                }
                
            }
            else {
                let userName = turnContext.activity.from.name;
                let skypeId1 = turnContext.activity.from.id;
                // This example hardcodes specific uterances. You should use LUIS or QnA for more advance language understanding.
                let text = turnContext.activity.text.toLowerCase();

                let greatingWords = ['hi', 'hello', 'what\'s up', 'wassup', 'sup', 'hey','greatings'];

                if (greatingWords.indexOf(text) > -1) {
                    await turnContext.sendActivity(`Hello again, ${userName} ${skypeId1}!`);
                    await this.welcomedUserPropery.set(turnContext, true);
                }else{
                    switch (text) {
                        case "intro":
                            await turnContext.sendActivity(`Sup ${userName}, i'm a helper bot. At this moment i'm doing little things`);
                            break;
                        case "help":
                            await turnContext.sendActivity(`Sup ${userName}, I'm here to help you!`);
                            break;
                        default:
                            await turnContext.sendActivity(`You said "${turnContext.activity.text}". Try to say "intro", "help" or greating me`);
                            break;
                    }
                }
            }
            
            // Save state changes
            await this.conversationState.saveChanges(turnContext);
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            // Send greeting when users are added to the conversation.
            await this.sendWelcomeMessage(turnContext);
        } else {
            // Generic message for all other activities
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }


    // Sends welcome messages to conversation members when they join the conversation.
    // Messages are only sent to conversation members who aren't the bot.
    async sendWelcomeMessage(turnContext) {
        // If any new membmers added to the conversation
        if (turnContext.activity && turnContext.activity.membersAdded) {
            // Define a promise that will welcome the user
            async function welcomeUserFunc(conversationMember) {
                // Greet anyone that was not the target (recipient) of this message.
                // The bot is the recipient of all events from the channel, including all ConversationUpdate-type activities
                // turnContext.activity.membersAdded !== turnContext.activity.aecipient.id indicates 
                // a user was added to the conversation 
                if (conversationMember.id !== this.activity.recipient.id) {
                    // Because the TurnContext was bound to this function, the bot can call
                    // `TurnContext.sendActivity` via `this.sendActivity`;
                    await this.sendActivity('A');
                    await this.sendActivity('B');
                    await this.sendActivity('C');
                    await this.sendActivity('D');
                }
            }

            // Prepare Promises to greet the  user.
            // The current TurnContext is bound so `replyForReceivedAttachments` can also send replies.
            const replyPromises = turnContext.activity.membersAdded.map(welcomeUserFunc.bind(turnContext));
            await Promise.all(replyPromises);
        }
    }
}

exports.EchoBot = EchoBot;