const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const { Permissions, Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, ThreadChannel } = require("discord.js");

require("dotenv").config();
require("colors");

const token = process.env.TOKEN;

const allIntents = new Intents(32767);

const fs = require('fs');
const { table } = require('table');


global.client = new Client({ intents: [allIntents] });
global.mongoURL = process.env.URI;

client.Database = require("./Databases/Mongoose.js");
global.guildData = async id => await client.Database.fetchGuild(id);
global.userData = async id => await client.Database.fetchUser(id);
global.memberData = async (id, guild) => await client.Database.fetchMember(id, guild);

global.Permissions = Permissions;
global.roles = require('./roles.json');
global.getEmoji = (emoji) => {
    return client.emojis.cache.find(e => e.name === emoji);
};

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

client.login(token)

const rest = new REST({ version: '9' }).setToken(token);

client.commandsSlash = new Collection();

const commandsSlash = [];
const commandFilesSlash = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFilesSlash) {
	const commandSlash = require(`./commands/${file}`);
	commandsSlash.push(commandSlash.data.toJSON());
};

for (const file of commandFilesSlash) {
	const commandSlash = require(`./commands/${file}`);
	client.commandsSlash.set(commandSlash.data.name, commandSlash);
}

client.on("ready", async () => {

    const data = [
        ['Client Name', 'Client ID'],
        [client.user.tag, client.user.id]
    ];

    console.log(`${table(data)}`.brightGreen);

    client.guilds.cache.forEach(guild => {
        rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: commandsSlash })
    });
});

client.on("guildCreate", guild => {
    rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: commandsSlash });
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    const guildInfo = await guildData(interaction.guild.id);
    const getRaid = await guildInfo.antiraid;

	const commandSlash = client.commandsSlash.get(interaction.commandName);

	if (!commandSlash) return;

    if(interaction.user.id !== interaction.guild.ownerId) {
        if(!getRaid.exceptions.includes(interaction.user.id)) {
            return interaction.reply({ content: `Opa, você não tem permissão para executar esse comando. Apenas meu dono ou as exceções fornecidas por ele.` });
        }
    }

	try {
		await commandSlash.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Ocorreu um erro ao executar esse comando.', ephemeral: true });
	}
});

client.on("guildMemberAdd", async member => {

  const guildInfo = await guildData(member.guild.id);
  if(guildInfo.antiraid.bot === "Desativado") return;
  if(!member.user.bot) return;

  member.kick("Módulo Anti Bots Ligado!")
})

client.on("guildMemberRemove", async member => {

    const fetchedLogs = await member.guild.fetchAuditLogs();
    const logs = fetchedLogs.entries.first();
    const guildInfo = await guildData(member.guild.id);

    let evento = logs.action;
    if(evento === "MEMBER_KICK") evento = "kick";
    if(evento === "MEMBER_BAN_ADD") evento = "ban";
    
    const getRaid = guildInfo.antiraid[evento];

    const { executor, target } = logs;

    if(getRaid === "Desativado") return;
    if(executor.id === client.user.id ) return;
    if(executor.id === member.guild.ownerId) return;

    const exceptionList = await guildInfo.antiraid.exceptions;
    if(exceptionList.includes(executor.id)) return;

    const memberInfo = await memberData(executor.id);

    if(logs.action === "MEMBER_KICK") {
        memberInfo.limits.kick = memberInfo.limits.kick + 1;
        memberInfo.markModified('limits.kick');
        await memberInfo.save();

        if(memberInfo.limits.kick > guildInfo.limits.kick) {
          punirUsuario(executor, member.guild);
        };
    }
    if(logs.action === "MEMBER_BAN_ADD") {
        memberInfo.limits.ban = memberInfo.limits.ban + 1;
        memberInfo.markModified('limits.ban');
        await memberInfo.save();

        if(memberInfo.limits.ban > guildInfo.limits.ban) {
          punirUsuario(executor, member.guild);
        };
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {

    const guildInfo = await guildData(newMember.guild.id);

    const getRaid = guildInfo.antiraid.role;
    if(getRaid === "Desativado") return;

    let oldRoleIDs = [];
    oldMember.roles.cache.each(role => {
        oldRoleIDs.push(role.id);
    });
    let newRoleIDs = [];
    newMember.roles.cache.each(role => {
        newRoleIDs.push(role.id);
    });
    if (newRoleIDs.length > oldRoleIDs.length) {
        function filterOutOld(id) {
            for (var i = 0; i < oldRoleIDs.length; i++) {
                if (id === oldRoleIDs[i]) {
                    return false;
                }
            }
            return true;
        }
        let onlyRole = newRoleIDs.filter(filterOutOld);

        let IDNum = onlyRole[0];

        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE',
        });
      
        const RoleLog = fetchedLogs.entries.first();
      
        const { executor, target } = RoleLog;
          
        if(executor.id === client.user.id ) return;
        if(executor.id === oldMember.guild.ownerId) return;

        const exceptionList = guildInfo.antiraid.exceptions;
        if(exceptionList.includes(executor.id)) return;

        punirUsuario(executor, newMember.guild);
    };
    if (newRoleIDs.length < oldRoleIDs.length) {
        function filterOutOld(id) {
            for (var i = 0; i < newRoleIDs.length; i++) {
                if (id === newRoleIDs[i]) {
                    return false;
                }
            }
            return true;
        }
        let onlyRole = oldRoleIDs.filter(filterOutOld);

        let IDNum = onlyRole[0];

        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
              type: 'MEMBER_ROLE_UPDATE',
          });
      
          const RoleLog = fetchedLogs.entries.first();
      
          const { executor, target } = RoleLog;
          
          if(executor.id === client.user.id ) return;
          if(executor.id === oldMember.guild.ownerId) return;
          
        const exceptionList = guildInfo.antiraid.exceptions;
        if(exceptionList.includes(executor.id)) return;

          punirUsuario(executor, newMember.guild);
    };
});

client.on("channelCreate", async channel => {

    const guildInfo = await guildData(channel.guild.id);

    let getRaid = guildInfo.antiraid.canal;
    if(getRaid === "Desativado") return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_CREATE'
    });
  
    const RoleLog = fetchedLogs.entries.first();
  
    const { executor, target } = RoleLog;
      
    if(executor.id === client.user.id ) return;
    if(executor.id === channel.guild.ownerId) return;
      
    const exceptionList = guildInfo.antiraid.exceptions;
    if(exceptionList.includes(executor.id)) return;

    punirUsuario(executor, channel.guild);
});

client.on("channelDelete", async channel => {

    const guildInfo = await guildData(channel.guild.id);

    let getRaid = guildInfo.antiraid.canal;
    if(getRaid === "Desativado") return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE'
    });
  
    const RoleLog = fetchedLogs.entries.first();
  
    const { executor, target } = RoleLog;
      
    if(executor.id === client.user.id ) return;
    if(executor.id === channel.guild.ownerId) return;
      
    const exceptionList = guildInfo.antiraid.exceptions;
    if(exceptionList.includes(executor.id)) return;

    punirUsuario(executor, channel.guild);
});

client.on('voiceStateUpdate', async (oldMember, newMember) => {
        
    const ms = require("ms");
    const guildInfo = await guildData(newMember.guild.id);

    if(!oldMember.channelId) return;
    if(newMember.id !== newMember.guild.ownerId) return;
    
    let getRaid = guildInfo.antiraid.voz;

    if(getRaid === "Desativado") return;

    const fetchedLogs = await newMember.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_DISCONNECT'
    });
  
    const disconnectLog = fetchedLogs.entries.first();
    const disconnectTime = Date.now() - new Date(disconnectLog.createdAt).getTime()
        
    if(disconnectTime > ms('1m')) return;
  
    const { executor, target } = disconnectLog;

    if(newMember.id !== newMember.guild.ownerId) return;
    if(executor.id === client.user.id ) return;
    if(executor.id === newMember.guild.ownerId) return;

    const exceptionList = guildInfo.antiraid.exceptions;
    if(exceptionList.includes(executor.id)) return;

    punirUsuario(executor, newMember.guild);
});

async function punirUsuario(user, guild) {
    const guildInfo = await guildData(guild.id);
    const getRaid = guildInfo.antiraid.mode;
    const u = guild.members.cache.get(user.id);
    if(getRaid === "role") {
        const userRoles = u._roles
        u.send({ content: `O módulo de Anti Raid foi ativado. Entre em contato com o dono do servidor para retirar sua punição.` });
        for(let i = 0; i < userRoles.length; i++) {
            u.roles.remove(userRoles[i]);
        }
    };
    if(getRaid === "ban") {
        await u.send({ content: `O módulo de Anti Raid foi ativado. Entre em contato com o dono do servidor para retirar sua punição.` });
        u.ban({ reason: `Anti Raid - Ativado` });
    };
    if(getRaid === "kick") {
        await u.send({ content: `O módulo de Anti Raid foi ativado. Entre em contato com o dono do servidor para retirar sua punição.` });
        u.kick({ reason: `Anti Raid - Ativado` });
    };
};

process.on('unhandledRejection', (reason, p) => {
    if(`${reason}`.includes("TypeError: Cannot convert undefined or null to object")) return;

    console.log(' [ ANTICRASH ] | SCRIPT REJEITADO'.brightRed);
    console.log(reason, p);
});
      
process.on("uncaughtException", (err, origin) => {
    console.log(' [ ANTICRASH ] | CATCH ERROR'.brightRed);
    console.log(err, origin);
}) 
      
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(' [ ANTICRASH ] | BLOQUEADO'.brightRed);
    console.log(err, origin);
});
      
process.on('multipleResolves', (type, promise, reason) => {
    console.log(' [ ANTICRASH ] | VÁRIOS ERROS'.brightRed);
    console.log(type, promise, reason);
});