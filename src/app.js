import tmi from 'tmi.js'
import {BLOCKED_WORDS, BOT_USERNAME, CHANNEL_NAME, OAUTH_TOKEN} from "./constant"

const options = {
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN,
    },
    channels: [ CHANNEL_NAME ]
}

const client = new tmi.Client(options);

client.connect().catch(console.error);


client.on('message', (channel, user, message, self) => {
    if(self) return;
    if (user.username === BOT_USERNAME) {
        console.log(`Not checking bot's messages.`)
        return
    }
    if(message.toLowerCase() === '!hello') {
        client.say(channel, `@${user.username}, Hey Hey!`);
    }
    checkTwitchChat(user, message, channel);

});

function checkTwitchChat(user, message, channel){
    //check message
    console.log(message)
    message = message.toLowerCase()
    let shouldSendMessage = false
    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))

    if(shouldSendMessage) {
        //tell user
        client.say(channel, `@${user.username}, sorry! Your message was deleted`)
        //delete the message
        client.deletemessage(channel, user.id)
    }

}