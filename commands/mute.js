const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Muta o usuário desejado pela quantia de tempo fornecida.')
        .addUserOption(option => option.setName('user')
            .setDescription('Selecione um usuário.')
            .setRequired(true))
        .addStringOption(option => option.setName('tempo')
            .setDescription('Forneça o tempo desejado do mute.')),
	async execute(interaction) {

        let user = interaction.options.getMember('user');
        let tempo = interaction.options.getString('tempo');
        if(!tempo) tempo = "1h";

        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return interaction.reply({ content: 'Você não tem permissão para mutar usuários nesse servidor.', ephemeral: true });

        const guildInfo = await guildData(interaction.guild.id)
        const muteRole = guildInfo.muteRole;
        if(!muteRole) return interaction.reply({ content: 'Não existe nenhum cargo de mute definido. Use: `/setmute <cargo>`', ephemeral: true });

        const member = await interaction.guild.members.cache.get(user.id);

        try {
            mute.set(`guilds.${interaction.guild.id}.${user.id}`, {
                id: user.id,
                tempo: Date.now() + ms(tempo),
                guild: interaction.guild.id,
                role: muteRole
            })
            guildInfo.logs.mute.push(`**${member.user.username}** foi mutado por **${interaction.user.tag}** pelo tempo: \`${tempo}\``);
            guildInfo.markModified('logs.mute');
            await guildInfo.save();
            
            await member.roles.add(muteRole)

            const muteEmbed = new MessageEmbed()
                .setTitle("Usuário Mutado")
                .addFields({
                    name: "Usuário",
                    value: `\`\`\`${member.user.username}\`\`\``,
                    inline: true
                },
                {
                    name: "Tempo",
                    value: `\`\`\`${tempo}\`\`\``,
                    inline: true
                },
                {
                    name: "Admin",
                    value: `\`\`\`${interaction.user.username}\`\`\``,
                    inline: true
                })
                .setColor("RED")
                .setThumbnail("https://cdn.pixabay.com/photo/2019/11/02/08/22/mute-4595879_1280.png")

            interaction.reply({ embeds: [muteEmbed], ephemeral: true });
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: 'Ocorreu um erro ao mutar o usuário.', ephemeral: true });
        }
  },
}