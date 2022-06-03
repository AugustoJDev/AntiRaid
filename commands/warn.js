const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Avisa um usuário.')
        .addUserOption(option => option.setName('user')
            .setDescription('Selecione um usuário.')
            .setRequired(true))
        .addStringOption(option => option.setName('motivo')
            .setDescription('Diga-nos o motivo do aviso.')),
	async execute(interaction) {
        let user = interaction.options.getMember('user');
        let motivo = interaction.options.getString('motivo');

        if(!motivo) motivo = "Sem Motivo.";
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.MANAGE_MEMBERS)) return interaction.reply({ content: 'Você não tem permissão para usar esse comando. Requer: `MANAGE_MEMBERS`.', ephemeral: true });

        const member = await client.users.cache.get(user.id);
        const guildInfo = await guildData(interaction.guild.id);
        const mUser = await memberData(member.id);
        const wrn = mUser.warns

        try {
            mUser.warns.count = mUser.warns.count + 1;
            mUser.warns.reasons.push(motivo);
            mUser.markModified('warns.count');
            mUser.markModified('warns.reasons');
            await mUser.save();

            guildInfo.logs.warn.push(`**${member.username}** foi avisado por **${interaction.user.tag}** pelo motivo: \`${motivo}\``);
            guildInfo.markModified('logs.warn');
            await guildInfo.save();
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: 'Ocorreu um erro ao avisar o usuário.', ephemeral: true });
        };

        const warnEmbed = new MessageEmbed()
            .setTitle("Usuário Avisado")
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
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/201/201643.png")
            .setColor("RED");

        interaction.reply({ embeds: [warnEmbed] });
  },
}