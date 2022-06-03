const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setmute')
		.setDescription('Seleciona o cargo de mutado do servidor.')
        .addRoleOption(option => option.setName('cargo')
            .setDescription('Selecione um cargo.')
            .setRequired(true)),
	async execute(interaction) {
        const role = interaction.options.getRole('cargo');

        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({ content: 'Você não tem permissão para criar cargos nesse servidor.', ephemeral: true });

        const guildInfo = await guildData(interaction.guild.id)

        try {
            guildInfo.muteRole = role.id;
            guildInfo.markModified('muteRole');
            await guildInfo.save();
            guildInfo.logs.mute.push(`**${role.name}** foi definido como cargo de mute.`)
            guildInfo.markModified('logs.mute');
            await guildInfo.save();
            interaction.reply({ content: `\`${role.name}\` definido como cargo de mute.`, ephemeral: true });
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: 'Ocorreu um erro ao definir o cargo de mute.', ephemeral: true });
        }
    },
}