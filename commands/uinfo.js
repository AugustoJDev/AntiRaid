const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uinfo')
		.setDescription('Mostra as informações sobre o seu limite de bans e kicks.'),
	async execute(interaction) {
    if(!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({
      content: `Você não tem permissão para usar esse comando. Requer: \`EXPULSAR MEMBROS\``,
      ephemeral: true
    });

    let memberInfo = await memberData(interaction.user.id);

    let memberEmbed = new MessageEmbed()
      .setTitle(`Informação dos Limites`)
      .addFields({
        name: "Bans",
        value: `\`\`\`${memberInfo.limits.ban}\`\`\``,
        inline: true
      },
      {
        name: "Kicks",
        value: `\`\`\`${memberInfo.limits.kick}\`\`\``,
        inline: true
      })

    interaction.reply({
      embeds: [memberEmbed],
      ephemeral: true
    })
  },
}