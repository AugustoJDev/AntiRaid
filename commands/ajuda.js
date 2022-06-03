const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ajuda')
		.setDescription('Mostra todos os comandos do bot.'),
	async execute(interaction) {
        const ajudaEmbed = new MessageEmbed()
            .setTitle("Lista de Comandos")
            .setDescription(
            "• **painel** - `Mostra as configurações de anti raid ligadas/desligadas do servidor e o modo de punição.`\n" +
            "• **logs** - `Mostra o painel de logs do servidor clicando na opção desejada do menu.`\n" +
            "• **antiraid <kick/ban/role/bot> <on/off>** - `Ativa/Desativa o modo de anti raid desejado.`\n" +
            "• **antiraid modo <ban/kick/role>** - `Irá alterar o jeito de punir o usuário, sendo: ban, kick ou tirar cargos.`\n" +
            "• **antiraid exception <usuário>** - `Irá dar permissão para um usuário usar meus comandos.`\n" +
            "• **antiraid remove <usuário>** - `Irá remover um usuário das minhas exceções.`\n" +
            "• **ban <usuario> <motivo>** - `Bane um usuário com o motivo fornecido.`\n" +
            "• **unban <id> <motivo>** - `Desbane um usuário com o motivo fornecido.`\n" +
            "• **warn <usuario> <motivo>** - `Avisa o usuário com o motivo fornecido.`\n" +
            "• **unwarn <usuario> <motivo>** - `Remove o aviso de um usuário com o motivo fornecido.`\n" +
            "• **warnlist <usuario>** - `Mostra a lista de avisos de um usuário.`\n" +
            "• **kick <usuario> <motivo>** - `Expulsa o usuário com o motivo fornecido.`\n" +
            "• **lockdown** - `Bloqueia e esconde todos os canais do servidor.`"
            )
            .setThumbnail(interaction.guild.iconURL())

        interaction.reply({ embeds: [ajudaEmbed], ephemeral: true });
  },
}