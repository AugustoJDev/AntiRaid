const mongoose = require("mongoose");

module.exports = mongoose.model("Guild", new mongoose.Schema({

    id: { type: String },
    registeredAt: { type: Number, default: Date.now() },
    limits: { type: Object, default: {
        ban: { type: Number, default: 1 },
        kick: { type: Number, default: 1 }
      }
    },
    muteRole: { type: String, default: null },
    antiraid: { type: Object, default: {
        bot: { type: String, default: "Desativado" },
        role: { type: String, default: "Desativado" },
        ban: { type: String, default: "Desativado" },
        kick: { type: String, default: "Desativado" },
        mode: { type: String, default: "role" },
        voz: { type: String, default: "Desativado" },
        canal: { type: String, default: "Desativado" },
        exceptions: { type: Array, default: [] },
    }},
    logs: { type: Object, default: {
        bot: { type: Array, default: [] },
        ban: { type: Array, default: [] },
        unban: { type: Array, default: [] },
        kick: { type: Array, default: [] },
        mute: { type: Array, default: [] },
        unmute: { type: Array, default: [] },
        antiraid: { type: Array, default: [] },
        lockdown: { type: Array, default: [] },
        warn: { type: Array, default: [] },
        unwarn: { type: Array, default: [] },
        vip: { type: Array, default: [] }
    }}
}));