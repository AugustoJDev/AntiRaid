const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('painel')
		.setDescription('Painel do sistema de Anti Raid.'),
	async execute(interaction) {
            
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: 'Você não tem permissão para usar esse comando. Requer: `ADMINISTRADOR`.', ephemeral: true });

        const antiR = await guildData(interaction.guild.id);
        let mode = antiR.antiraid.mode;
        if(mode == "kick") mode = "Expulsar";
        if(mode == "ban") mode = "Banir";
        if(mode == "role") mode = "Tirar Cargos";

        const antiraidEmbed = new MessageEmbed()
            .setTitle("Painel de Defesa do Servidor")
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(`O modo de defesa do servidor está configurado para: \`${mode}\``)
            .addFields({
                name: `${getEmoji(antiR.antiraid.ban)} Defesa contra Banimentos`,
                value: `\`\`\`/antiraid ban on|off\`\`\``,
                inline: true
            },
            {
                name: `${getEmoji(antiR.antiraid.kick)} Defesa contra Expulsões`,
                value: `\`\`\`/antiraid kick on|off\`\`\``,
                inline: true
            },
            {
                name: `${getEmoji(antiR.antiraid.role)} Defesa contra Exclusão de Cargos`,
                value: `\`\`\`/antiraid role on|off\`\`\``,
                inline: true
            },
            {
                name: `${getEmoji(antiR.antiraid.canal)} Defesa contra Exclusão/Criação de Canais`,
                value: `\`\`\`/antiraid canal on|off\`\`\``,
                inline: true
            },
            {
                name: `${getEmoji(antiR.antiraid.voz)} Defesa contra Desconexão da Chamada`,
                value: `\`\`\`/antiraid voz on|off\`\`\``,
                inline: true
            },
            {
                name: `${getEmoji(antiR.antiraid.bot)} Defesa contra Expulsão de Bots não Permitidos`,
                value: `\`\`\`/antiraid bot on|off\`\`\``,
                inline: true
            },
            {
                name: `${antiR.limits.ban} - Limite de Bans`,
                value: `\`\`\`/setlimit Bans <quantia>\`\`\``,
                inline: true
            },
            {
                name: `${antiR.limits.kick} - Limite de Kicks`,
                value: `\`\`\`/setlimit Kicks <quantia>\`\`\``,
                inline: true
            })

        interaction.reply({ embeds: [antiraidEmbed], ephemeral: true });
  },
}