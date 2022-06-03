const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")



module.exports = {
	data: new SlashCommandBuilder()
		.setName('nome')
		.setDescription('Base para comandos.'),
	async execute(interaction) {

  },
}