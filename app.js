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
import * as handle from './handles.js';
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
const game = {};

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
    return handle.ping(req, res);
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" guild command
    if (name === 'test') {
      return handle.test(req, res);
    }
    if (name === 'challenge') { //OLD GAME DELETE LATER
      return handle.challenge(req, res, game);
    }
    if(name === 'penis') {      
      return handle.penis(req, res);
    }
    if(name === 'emojitest') {
      return handle.emojitest(req, res);
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