const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setlimit')
		.setDescription('Seta o limite de quandos bans/kicks os usuários podem dar antes de serem punidos.')
    .addNumberOption(option =>
      option.setName('quantia')
        .setDescription('Forneça a quantidade máxima.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option')
        .setDescription('Selecione a opção desejada.')
        .setRequired(true)
        .addChoices(
          {
            name: "Bans", value: "ban"
          },
          {
            name: "Kicks", value: "kick"
          })),
	async execute(interaction) {
    let limit = interaction.options.getNumber('quantia');
    let option = interaction.options.getString('option');

    let guildInfo = await guildData(interaction.guild.id);

    guildInfo.limits[option] = limit;
    guildInfo.markModified('limits.' + option)
    guildInfo.save();

    const limitEmbed = new MessageEmbed()
      .setTitle(`Limite Definido - ${option}`)
      .setDescription(`O limite de ${option}s foi definido com sucesso para \`${limit}\`.`)

    interaction.reply({
      embeds: [limitEmbed],
      ephemeral: true
    });
  },
}