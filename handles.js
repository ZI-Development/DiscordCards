import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { MessageEmbed, Client, Intents } from 'discord.js';


export function ping(req, res) {
    return res.send({ type: InteractionResponseType.PONG });
}
  
  
export function test(req, res) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
}

export function challenge(req, res, game) {
  const userId = req.body.member.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;

      // Create active game using message ID as the game ID
      game = {
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

export function penis(req, res) {
  const exampleEmbed = new MessageEmbed()
        .setImage('https://cdn.glitch.global/90bcdd4c-d30a-4fb8-89d2-11bb34f0fbde/penis.png?v=1655920368058');

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [exampleEmbed]
        },
      });
}

export function emojitest(req, res, client) {
  console.log(req)
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'hello world ' + req.ctx.guild.emojis.cache.get("989266835146960897").toString(),
    },
  });
}

export function blobs(req, res, client) {
  var cards = JSON.parse('../star-realms/cars.js');
  cards.fir
  return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            new MessageEmbed().setImage('https://cdn.glitch.global/90bcdd4c-d30a-4fb8-89d2-11bb34f0fbde/Mothership.png?v=1655926882042'),         
            new MessageEmbed().setImage('https://cdn.glitch.global/90bcdd4c-d30a-4fb8-89d2-11bb34f0fbde/Battle%20Blob.png?v=1655926885644')
        ]}        
      });
}