const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('antiraid')
		.setDescription('Ativa/Desativa as funções do Anti Raid.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Ativa/Desativa a função de banir usuário.')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('On ativa, Off desativa.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "On", value: "on"
                          },
                          {
                            name: "Off", value: "off"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Ativa/Desativa a função de anti bots.')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('On ativa, Off desativa.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "On", value: "on"
                          },
                          {
                            name: "Off", value: "off"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Ativa/Desativa a função de expulsar usuário.')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('On ativa, Off desativa.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "On", value: "on"
                          },
                          {
                            name: "Off", value: "off"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Ativa/Desativa a função de remover cargo.')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('On ativa, Off desativa.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "On", value: "on"
                          },
                          {
                            name: "Off", value: "off"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('canal')
                .setDescription('Ativa/Desativa a função de deletar/criar canais.')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('On ativa, Off desativa.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "On", value: "on"
                          },
                          {
                            name: "Off", value: "off"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('voz')
                .setDescription('Ativa/Desativa a função de remover do canal de voz.')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('On ativa, Off desativa.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "On", value: "on"
                          },
                          {
                            name: "Off", value: "off"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('modo')
                .setDescription('Muda o modo de punição do anti raid.')
                .addStringOption(option =>
                    option.setName('modo')
                        .setDescription('Os modos são: ban, kick e role.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "Ban", value: "ban"
                          },
                          {
                            name: "Kick", value: "kick"
                          },
                          {
                            name: "Role", value: "role"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('todos')
                .setDescription('Liga/Desliga todos os modos de defesa de uma vez.')
                .addStringOption(option =>
                    option.setName('modo')
                        .setDescription('As opções são: ligar/desligar.')
                        .setRequired(true)
                        .addChoices(
                          {
                            name: "Ligar", value: "on"
                          },
                          {
                            name: "Desligar", value: "off"
                          })))
        .addSubcommand(subcommand =>
            subcommand
                .setName('exception')
                .setDescription('Dá permissão para um usuário usar meus comandos.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Forneça o usuário que será adicionado como exceção.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove um usuário das minhas exceções.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Forneça o usuário que será removido das minhas exceções.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lista as exceções do anti raid.')),
	async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildInfo = await guildData(interaction.guild.id);

        if(interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: 'Você não tem permissão para usar esse comando. Requer: `DONO`.', ephemeral: true });

        if(subcommand === 'bot') {

            const status = interaction.options.getString('status');

            console.log(status)
          
            const antiREmbed = new MessageEmbed()
                .setTitle(`Defesa do Servidor - ${subcommand}`)
                .setDescription(`O modo de defesa do servidor está no status: \`${status}\``);

            if(status === 'on') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.bot = "Ativado"
                guildInfo.markModified('antiraid.bot');
                await guildInfo.save();
            } else {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.bot = "Desativado"
                guildInfo.markModified('antiraid.bot');
                await guildInfo.save();
            };
        };
        if(subcommand === 'ban') {

            const status = interaction.options.getString('status');

            const antiREmbed = new MessageEmbed()
                .setTitle(`Defesa do Servidor - ${subcommand}`)
                .setDescription(`O modo de defesa do servidor está no status: \`${status}\``);

            if(status === 'on') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.ban = "Ativado"
                guildInfo.markModified('antiraid.ban');
                await guildInfo.save();
            } else {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.ban = "Desativado"
                guildInfo.markModified('antiraid.ban');
                await guildInfo.save();
            };
        };
        if(subcommand === 'kick') {

            const status = interaction.options.getString('status');

            const antiREmbed = new MessageEmbed()
                .setTitle(`Defesa do Servidor - ${subcommand}`)
                .setDescription(`O modo de defesa do servidor está no status: \`${status}\``);

            if(status === 'on') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.kick = "Ativado"
                guildInfo.markModified('antiraid.kick');
                await guildInfo.save();
            } else {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.kick = "Desativado"
                guildInfo.markModified('antiraid.kick');
                await guildInfo.save();
            };
        };
        if(subcommand === 'canal') {

            const status = interaction.options.getString('status');

            const antiREmbed = new MessageEmbed()
                .setTitle(`Defesa do Servidor - ${subcommand}`)
                .setDescription(`O modo de defesa do servidor está no status: \`${status}\``);

            if(status === 'on') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.canal = "Ativado"
                guildInfo.markModified('antiraid.canal');
                await guildInfo.save();
            } else {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.canal = "Desativado"
                guildInfo.markModified('antiraid.canal');
                await guildInfo.save();
            };
        }
        if(subcommand === 'voz') {
    
                const status = interaction.options.getString('status');
    
                const antiREmbed = new MessageEmbed()
                    .setTitle(`Defesa do Servidor - ${subcommand}`)
                    .setDescription(`O modo de defesa do servidor está no status: \`${status}\``);
    
                if(status === 'on') {
                    interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                    guildInfo.antiraid.voz = "Ativado"
                    guildInfo.markModified('antiraid.voz');
                    await guildInfo.save();
                } else {
                    interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                    guildInfo.antiraid.voz = "Desativado"
                    guildInfo.markModified('antiraid.voz');
                    await guildInfo.save();
                };
        }
        if(subcommand === 'role') {

            const status = interaction.options.getString('status');

            const antiREmbed = new MessageEmbed()
                .setTitle(`Defesa do Servidor - ${subcommand}`)
                .setDescription(`O modo de defesa do servidor está no status: \`${status}\``);

            if(status === 'on') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.role = "Ativado"
                guildInfo.markModified('antiraid.role');
                await guildInfo.save();
            } else {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.role = "Desativado"
                guildInfo.markModified('antiraid.role');
                await guildInfo.save();
            };
        };
        if(subcommand === 'modo') {

            const modo = interaction.options.getString('modo');

            const antiREmbed = new MessageEmbed()
                .setTitle(`Defesa do Servidor - ${subcommand}`)
                .setDescription(`O modo de defesa do servidor está configurado para: \`${modo}\``);

            if(modo === 'ban') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.mode = "ban"
                guildInfo.markModified('antiraid.mode');
                await guildInfo.save();
            } else if(modo === 'kick') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.mode = "kick"
                guildInfo.markModified('antiraid.mode');
                await guildInfo.save();
            } else if(modo === 'role') {
                interaction.reply({ embeds: [antiREmbed], ephemeral: true });
                guildInfo.antiraid.mode = "role"
                guildInfo.markModified('antiraid.mode');
                await guildInfo.save();
            };
        };
        if(subcommand === 'exception') {
                
            const user = interaction.options.getMember('user');

            const antiREmbed = new MessageEmbed()
                    .setTitle(`Defesa do Servidor - ${subcommand}`)
                    .setDescription(`O usuário ${user} foi adicionado como exceção.`);

            interaction.reply({ embeds: [antiREmbed], ephemeral: true });
            guildInfo.antiraid.exceptions.push(user.id);
            guildInfo.markModified('antiraid.exceptions');
            await guildInfo.save();
        };
        if(subcommand === 'remove') {

            const user = interaction.options.getMember('user');

            const antiREmbed = new MessageEmbed()
                    .setTitle(`Defesa do Servidor - ${subcommand}`)
                    .setDescription(`O usuário ${user} foi removido das exceções.`);

            interaction.reply({ embeds: [antiREmbed], ephemeral: true });
            guildInfo.antiraid.exceptions.splice(guildInfo.antiraid.exceptions.indexOf(user.id), 1);
            guildInfo.markModified('antiraid.exceptions');
            await guildInfo.save();
        };
        if(subcommand === 'list') {

            let exceptionList = await guildInfo.antiraid.exceptions;
                exceptionList = exceptionList.map(u => `• <@${u}>`).join("\n");
            if(!exceptionList) "Não há exceções.";

            const antiREmbed = new MessageEmbed()
                .setTitle(`Defesa do Servidor - ${subcommand}`)
                .setDescription(`Lista de Exceções: \n${exceptionList}`);

            interaction.reply({ embeds: [antiREmbed], ephemeral: true });
        };
        if(subcommand === 'todos') {

            const modo = interaction.options.getString('modo');

            if(modo === 'on') {
                interaction.reply({ content: 'O modo de defesa do servidor foi ativado.', ephemeral: true });
                guildInfo.antiraid.ban = "Ativado"
                guildInfo.markModified('antiraid.ban');
                guildInfo.antiraid.kick = "Ativado"
                guildInfo.markModified('antiraid.kick');
                guildInfo.antiraid.role = "Ativado"
                guildInfo.markModified('antiraid.role');
                guildInfo.antiraid.voz = "Ativado"
                guildInfo.markModified('antiraid.voz');
                guildInfo.antiraid.canal = "Ativado"
                guildInfo.markModified('antiraid.canal');
                await guildInfo.save();
            };
            if(modo === 'off') {
                interaction.reply({ content: 'O modo de defesa do servidor foi desativado.', ephemeral: true });
                guildInfo.antiraid.ban = "Desativado"
                guildInfo.markModified('antiraid.ban');
                guildInfo.antiraid.kick = "Desativado"
                guildInfo.markModified('antiraid.kick');
                guildInfo.antiraid.role = "Desativado"
                guildInfo.markModified('antiraid.role');
                guildInfo.antiraid.voz = "Desativado"
                guildInfo.markModified('antiraid.voz');
                guildInfo.antiraid.canal = "Desativado"
                guildInfo.markModified('antiraid.canal');
                await guildInfo.save();
            };
        };
  },
}