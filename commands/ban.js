const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bane o usuário escolhido.')
        .addUserOption(option => option.setName('user')
            .setDescription('Selecione um usuário.')
            .setRequired(true))
        .addStringOption(option => option.setName('motivo')
            .setDescription('Diga-nos o motivo do banimento.')),
	async execute(interaction) {
        let user = interaction.options.getMember('user');
        let motivo = interaction.options.getString('motivo');

        const guildInfo = await guildData(interaction.guild.id);
        
        if(!motivo) motivo = "Sem Motivo.";
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({ content: 'Você não tem permissão para banir usuários nesse servidor.', ephemeral: true });

        const member = await client.users.cache.get(user.id);

        try {
            guildInfo.logs.ban.push(`**${member.username}** foi banido por **${interaction.user.tag}** pelo motivo: \`${motivo}\``);
            guildInfo.markModified('logs.ban');
            await guildInfo.save();
            await interaction.guild.members.ban(user.id, { reason: `${motivo}` });
        } catch (error) {
            return interaction.reply({ content: 'Ocorreu um erro ao banir o usuário.', ephemeral: true });
        }

        const banEmbed = new MessageEmbed()
            .setTitle("Usuário Banido")
            .addFields({
                name: "Usuário",
                value: `\`\`\`${member.username}\`\`\``,
            },
            {
                name: "Motivo",
                value: `\`\`\`${motivo}\`\`\``
            },
            {
                name: "Admin",
                value: `\`\`\`${interaction.user.username}\`\`\``
            })
            .setColor("RED")
            .setThumbnail("https://i.pinimg.com/originals/85/cf/9a/85cf9a09e6f821388a9e816341450de3.png")
            .setFooter("Veja os logs de banimento com o comando /logs")

        interaction.reply({ embeds: [banEmbed] });
  },
}