global.userSchema = require("./Schema/User.js"),
      guildSchema = require("./Schema/Guild.js"),
      memberSchema = require("./Schema/Member.js"),
      mongoose = require("mongoose");
      
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('[+]'.brightGreen + ' Conectado no Banco de Dados'.blue);
}).catch((err) => {
    console.log(`Não foi possível conectar no Banco de Dados.\nError: ${err}`.brightRed);
});

module.exports.fetchUser = async function(key){

    let userDB = await userSchema.findOne({ id: key });
    if(userDB) {
        return userDB;
    } else {
        userDB = new userSchema({
            id: key,
            registeredAt: Date.now()
        })
        await userDB.save().catch(err => console.log(err));
        return userDB;
    }
};

module.exports.fetchGuild = async function(key){

    let guildDB = await guildSchema.findOne({ id: key });

    if(guildDB){
        return guildDB;
    }else{
        guildDB = new guildSchema({
            id: key,
            registeredAt: Date.now(),
            muteRole: null,
            antiraid: { 
                bot: "Desativado",
                role: "Desativado",
                ban: "Desativado",
                kick: "Desativado",
                mode: "role",
                voz: "Desativado",
                canal: "Desativado",
                exceptions: [],
            },
            logs: {
                bot: [],
                ban: [],
                unban: [],
                kick: [],
                mute: [],
                unmute: [],
                antiraid: [],
                lockdown: [],
                warn: [],
                unwarn: [],
                vip: []
            }
        })
        await guildDB.save().catch(err => console.log(err));
        return guildDB;
    }
};

module.exports.fetchMember = async function(userID, guildID){

    let memberDB = await memberSchema.findOne({ id: userID, guildID: guildID });
    if(memberDB){
        return memberDB;
    } else {
        memberDB = new memberSchema({
            id: userID,
            guildID: guildID,
            registeredAt: Date.now(),
            limits: {
              ban: 0,
              kick: 0
            },
            warns: { 
              count: 0,
              reasons: []
            },
            mute: {
                tempo: 0
            },
        })
        await memberDB.save().catch(err => console.log(err));
        return memberDB;
    };
};