const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription('Mostra todos os logs do servidor.'),
	async execute(interaction) {

        const guildInfo = await guildData(interaction.guild.id);

        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: 'Você não tem permissão para usar esse comando. Requer: `ADMINISTRADOR`.', ephemeral: true });

        interaction.reply({ content: "Cuidando mexendo nisso na frente dos outros :eyes:", ephemeral: true })

        const logsEmbed = new MessageEmbed()    
            .setTitle("Selecione os Logs")
            .setDescription("Selecione no menu abaixo o menu de logs que deseja abrir.")

        const logsMenu = new MessageSelectMenu()
            .setCustomId('logs_menu')
            .setPlaceholder('Nada Selecionado')
            .addOptions([
                {
                    label: 'Banidos',
                    description: 'Log de bans.',
                    value: 'ban'
                },
                {
                    label: 'Desbanidos',
                    description: 'Log de desbanidos.',
                    value: 'unban'
                },
                {
                    label: 'Avisados',
                    description: 'Log de avisos.',
                    value: 'warn'
                },
                {
                    label: 'Desavisados',
                    description: 'Log de desavisos.',
                    value: 'unwarn'
                },
                {
                    label: 'Mutados',
                    description: 'Log de mutados.',
                    value: 'mute'
                },
                {
                    label: 'Desmutados',
                    description: 'Log de desmutados.',
                    value: 'unmute'
                }
            ])

        const logsRow = new MessageActionRow()
            .addComponents(logsMenu)

        const msg = await interaction.channel.send({ embeds: [logsEmbed], components: [logsRow], ephemeral: true });

        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        msg.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
        .then(async interaction => {

            const option = interaction.values[0];
            
            let pagina = 1;
            let logsArray = await guildInfo.logs[option];
            logsArray = {
                "1": logsArray.map(i => i).slice(0, 10),
                "2": logsArray.map(i => i).slice(10, 20),
                "3": logsArray.map(i => i).slice(20, 30)
            };

            const logEmbed = new MessageEmbed()
                .setTitle(`Logs de ${option}`)
                .setDescription(logsArray[pagina.toString()].join("\n"))

            const msg = await interaction.channel.send({ embeds: [logEmbed] });
                
            msg.react("⬅️");
            msg.react("➡️");
            
            const filter = (reaction, user) => {
                return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === interaction.user.id;
            };

            const collector = msg.createReactionCollector(filter, { time: 60000 });

            collector.on('collect', async (reaction, user) => {
                if(user.id !== interaction.user.id) return;

                if(reaction.emoji.name === "⬅️") {
                    if(pagina === 1) return;
                    pagina--;
                    msg.edit({ embeds: [logEmbed.setDescription(logsArray[pagina.toString()].join("\n"))] });
                } else if(reaction.emoji.name === "➡️") {
                    if(pagina === 3) return;
                    pagina++;
                    msg.edit({ embeds: [logEmbed.setDescription(logsArray[pagina.toString()].join("\n"))] });
                }
            });
        });
  },
}