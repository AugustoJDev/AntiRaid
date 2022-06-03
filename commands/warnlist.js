const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnlist')
		.setDescription('Mostra a quantidade de avisos e os avisos de um usuário.')
        .addUserOption(option => option.setName('user')
            .setDescription('Selecione um usuário.')
            .setRequired(true)),
	async execute(interaction) {

        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.MANAGE_MEMBERS)) return interaction.reply({ content: 'Você não tem permissão para usar esse comando. Requer: `MANAGE_MEMBERS`.', ephemeral: true });

        const user = interaction.options.getMember('user');
        const member = await client.users.cache.get(user.id);
        const guildInfo = await guildData(interaction.guild.id);
        const mUser = await memberData(user.id);
        const wrns = mUser.warns
        if(wrns.count === 0) return interaction.reply({ content: 'Esse usuário não possui avisos.', ephemeral: true });

        const warnlistEmbed = new MessageEmbed()
            .setTitle("Lista de Avisos")
            .addFields({
                name: "Usuário",
                value: `\`\`\`${member.tag}\`\`\``,
                inline: true
            },
            {
                name: "Contagem",
                value: `\`\`\`${wrns.count}\`\`\``,
                inline: true
            },
            {
                name: "Avisos",
                value: `\`\`\`${wrns.reasons.map(x => `- ${x}`).join("\n")}\`\`\``
            });

        interaction.reply({ embeds: [warnlistEmbed] });
  },
}