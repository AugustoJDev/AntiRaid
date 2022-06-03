const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Desbane o usuário escolhido.')
        .addStringOption(option => option.setName('user')
            .setDescription('Forneça o ID do usuário.')
            .setRequired(true))
        .addStringOption(option => option.setName('motivo')
            .setDescription('Diga-nos o motivo do desbanimento.')),
	async execute(interaction) {
        let user = interaction.options.getString('user');
        let motivo = interaction.options.getString('motivo');

        if(!motivo) motivo = "Sem Motivo.";
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({ content: 'Você não tem permissão para desbanir usuários nesse servidor.', ephemeral: true });

        const member = await interaction.guild.bans.fetch(user);
        const guildInfo = await guildData(interaction.guild.id);

        try {
            guildInfo.logs.unban.push(`**${member.user.username}** foi desbanido por **${interaction.user.tag}** pelo motivo: \`${motivo}\``);
            guildInfo.markModified('logs.unban');
            await guildInfo.save();
            
            await interaction.guild.members.unban(user, { reason: `${motivo}` });
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: 'Ocorreu um erro ao desbanir o usuário.', ephemeral: true });
        };

        const unbanEmbed = new MessageEmbed()
            .setTitle("Usuário Desbanido")
            .addFields({
                name: "Usuário",
                value: `\`\`\`${member.user.username}\`\`\``,
            },
            {
                name: "Motivo",
                value: `\`\`\`${motivo}\`\`\``
            },
            {
                name: "Admin",
                value: `\`\`\`${interaction.user.username}\`\`\``
            })
            .setColor("GREEN")
            .setThumbnail("https://i.pinimg.com/originals/85/cf/9a/85cf9a09e6f821388a9e816341450de3.png")
            .setFooter("Veja os logs de desbanimento com o comando /logs");

        interaction.reply({ embeds: [unbanEmbed] });
  },
}