const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const logs = require('./logs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lockdown')
		.setDescription('Bloqueia e esconde todos os canais do servidor.'),
	async execute(interaction) {

		if(!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'Você não tem permissão para usar esse comando. Requer: `ADMINISTRADOR`.', ephemeral: true });

		const guildInfo = await guildData(interaction.guild.id);

		const lockdownEmbed = new MessageEmbed()
			.setTitle("Lockdown")
			.setDescription("Todos os canais foram bloqueados e escondidos. Caso algum usuário ainda veja algum canal, tente tirar os cargos dele, pois pode haver a permissão `VER CANAL`")
			.setColor("RED")
			.setThumbnail("https://cdn-icons-png.flaticon.com/512/3208/3208742.png")

		await interaction.reply({ embeds: [lockdownEmbed], ephemeral: true });

		guildInfo.logs.lockdown.push(`**${interaction.user.username}** bloqueou e escondeu todos os canais do servidor.`)
		guildInfo.markModified('logs.lockdown');
		await guildInfo.save();

        var chan = [];

        await interaction.guild.channels.cache.map(c => chan.push({
            id: c.id,
            type: c.type
        }));

        for(let i = 0; i < chan.length; i++) {
            if (chan[i].type === "GUILD_TEXT") {
                interaction.guild.channels.cache.get(chan[i].id).permissionOverwrites.set([
					{
						id: interaction.guild.id,
						deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]
					},
					{
						id: guildInfo.muteRole,
						deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]
					}
				])
            }
            if (chan[i].type === "GUILD_VOICE") {
                interaction.guild.channels.cache.get(chan[i].id).permissionOverwrites.set([
					{
						id: interaction.guild.id,
						deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK]
					},
					{
						id: guildInfo.muteRole,
						deny: [Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK]
					}
				]);
            }
        }
  },
}