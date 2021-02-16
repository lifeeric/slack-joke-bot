const { App } = require("@slack/bolt");
const axios = require("axios");
// Initializes your app with your bot token and signing secret

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACKSIGNING_SECRET,
});

// Listens to incoming messages that contain "hello"
app.message("joke hello", async ({ message, say }) => {
  // say() sends a message to1 the channel where the event was triggered
  console.log(message);

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me",
          },
          action_id: "button_click",
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

// Listens to incoming messages that contains "joke"

app.message("joke random", async ({ message, say }) => {
  //   console.log(message);

  // fetch joke
  const todaysJoke = await axios.get("http://api.icndb.com/jokes/random");

  console.log(todaysJoke.data.value.joke);

  await say(`${todaysJoke.data.value.joke}`);
});

// Listens to icoming messages that contains "youmama"
app.message("joke yomomma", async ({ message, say }) => {
  // fetch joke
  const todaysJoke = await axios.get("http://api.yomomma.info");
  await say(`${todaysJoke.data.joke}`);
});

app.action("button_click", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

// Help command
app.message("help", async ({ message, say }) => {
  await say(
    `Hey <@${message.user}>! Type joke with either 'yomomma', 'random' or 'hello' to get a joke`
  );
});

(async () => {
  // start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
