const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teste')
		.setDescription('Testando banco de dados novo.'),
	async execute(interaction) {

        let antiR = await guildData(interaction.guild.id);

        console.log(antiR.logs["ban"]);

        interaction.reply({
            content: "Teste de banco de dados concluído.",
            ephemeral: true
        });
  },
}