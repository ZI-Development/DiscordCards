import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import {
  CHALLENGE_COMMAND,
  TEST_COMMAND,
  PENIS_COMMAND,
  BLOBS_COMMAND,
  EMOJITEST_COMMAND,
  HasGuildCommands,
} from './commands.js'; 
import { testHandle } from './handles.js';
import { MessageEmbed, Client, Intents } from 'discord.js';
//const { MessageEmbed } = require('discord.js');

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" guild command
    if (name === 'test') {
      return testHandle(req, res);
    }
    if (name === 'challenge' && id) {
      const userId = req.body.member.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;

      // Create active game using message ID as the game ID
      activeGames[id] = {
        id: userId,
        objectName,
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `Rock papers scissors challenge from <@${userId}>`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  // Append the game ID to use later on
                  custom_id: `accept_button_${req.body.id}`,
                  label: 'Accept',
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
    if(name === 'penis') {      
      const exampleEmbed = new MessageEmbed()
        .setImage('https://cdn.glitch.global/90bcdd4c-d30a-4fb8-89d2-11bb34f0fbde/penis.png?v=1655920368058');

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [exampleEmbed]
        },
      });
    }
    if(name === 'emojitest') {
      console.log(guild.emojis.cache)
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'hello world ' + client.emojis.cache.find(emoji => emoji.name === "Mothership").toString(),
        },
      });
    }
    if(name === 'blobs') {        
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            new MessageEmbed().setImage('https://cdn.glitch.global/90bcdd4c-d30a-4fb8-89d2-11bb34f0fbde/Mothership.png?v=1655926882042'),         
            new MessageEmbed().setImage('https://cdn.glitch.global/90bcdd4c-d30a-4fb8-89d2-11bb34f0fbde/Battle%20Blob.png?v=1655926885644')
        ]}        
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    CHALLENGE_COMMAND,
    PENIS_COMMAND,
    BLOBS_COMMAND,
    EMOJITEST_COMMAND,
  ]);
});