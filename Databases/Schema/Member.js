const mongoose = require("mongoose");

module.exports = mongoose.model("Member", new mongoose.Schema({
    id: { type: String },
    guild: { type: String },
    registeredAt: { type: Number, default: Date.now() },
    limits: { type: Object, default: {
        ban: { type: Number, default: 0 },
        kick: { type: Number, default: 0 }
      }
    },
    warns: { type: Object, default: {
        count: { type: Number, default: 0 },
        reasons: { type: Array, default: [] }
    }},
    mute: {
        tempo: { type: Number, default: 0 }
    },
}));