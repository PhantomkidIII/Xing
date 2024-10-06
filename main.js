// Import required modules
require('./settings');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const chalk = require('chalk');
const { Low, JSONFile } = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const NodeCache = require("node-cache");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } = require("@whiskeysockets/baileys");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

// Define session directory and file
const sessionDir = './session';
const sessionFile = `${sessionDir}/creds.json`;

// Check if session directory exists
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

// Load SESSION_ID from environment or use default
global.SESSION_ID = process.env.SESSION_ID || {
    // default session data structure (modify as per your needs)
    "noiseKey": { "private": { "type": "Buffer", "data": "iMr76cDGEhCvAI194Q0Q+2efmqRikjVeDYQGI98/PUo=" }, "public": { "type": "Buffer", "data": "HYPsmSxeaW/mIMROPeJKuof+eUYl9YRncZqVxK979Xk=" } },
    // Add other default session values if needed
};

// Function to load the session or credentials
async function loadSession() {
    let state;
    
    // Check if creds.json exists and load it
    if (fs.existsSync(sessionFile)) {
        const sessionData = JSON.parse(fs.readFileSync(sessionFile));
        state = {
            creds: sessionData.SESSION_ID || global.SESSION_ID,  // Use loaded creds or fallback
            keys: {}, // Adjust this if you have keys stored separately
        };
        console.log(chalk.green('Loaded credentials from creds.json'));
    } else {
        // If creds.json doesn't exist, use global.SESSION_ID
        state = {
            creds: global.SESSION_ID, // Use SESSION_ID directly
            keys: {}, // Adjust if needed
        };
        console.log(chalk.yellow('No creds.json found. Using SESSION_ID.'));
    }

    return state;
}

async function startAlyaBotInc() {
    let { version, isLatest } = await fetchLatestBaileysVersion();
    const state = await loadSession(); // Load session credentials

    const msgRetryCounterCache = new NodeCache();
    const AlyaBotInc = makeWASocket({
        logger: pino({ level: 'silent' }),
        browser: Browsers.windows('Firefox'),
        auth: {
            creds: state.creds,
            keys: state.keys,
        },
        msgRetryCounterCache,
    });

    // Save credentials function
    const saveCredentialsToFile = async () => {
        const sessionData = { SESSION_ID: state.creds };
        fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
        console.log(chalk.green('Saved new credentials to creds.json'));
    };

    AlyaBotInc.ev.on('creds.update', async () => {
        await saveCredentialsToFile(); // Save credentials to file on update
    });

    // Connection update handling
    AlyaBotInc.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        try {
            if (connection === 'close') {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                console.log(`Connection closed with reason: ${reason}`);
                startAlyaBotInc();
            } else if (connection === 'open') {
                console.log(color(`Connected as: ${JSON.stringify(AlyaBotInc.user, null, 2)}`, 'yellow'));
                // Further logic here...
            }
        } catch (err) {
            console.log('Error in connection update: ' + err);
            startAlyaBotInc();
        }
    });
}

// Start the bot
startAlyaBotInc();
	
AlyaBotInc.ev.on('creds.update', saveCreds)
AlyaBotInc.ev.on("messages.upsert",  () => { })
//------------------------------------------------------

//farewell/welcome
    AlyaBotInc.ev.on('group-participants.update', async (anu) => {
    	if (global.welcome){
console.log(anu)
try {
let metadata = await AlyaBotInc.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await AlyaBotInc.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await AlyaBotInc.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
//welcome\\
memb = metadata.participants.length
AlyaWlcm = await getBuffer(ppuser)
AlyaLft = await getBuffer(ppuser)
                if (anu.action == 'add') {
                const alyabuffer = await getBuffer(ppuser)
                let alyaName = num
                const xtime = moment.tz('Africa/Nairobi').format('HH:mm:ss')
	            const xdate = moment.tz('Africa/Nairobi').format('DD/MM/YYYY')
	            const xmembers = metadata.participants.length
                alyabody = `┌─❖
│「 𝗛𝗶 👋 」
└┬❖ 「  @${alyaName.split("@")[0]}  」
   │✑  𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 
   │✑  ${metadata.subject}
   │✑  𝗠𝗲𝗺𝗯𝗲𝗿 : 
   │✑ ${xmembers}th
   │✑  𝗝𝗼𝗶𝗻𝗲𝗱 : 
   │✑ ${xtime} ${xdate}
   └───────────────┈ ⳹`
let msgs = generateWAMessageFromContent(anu.id, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: alyabody
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: botname
          }),
          header: proto.Message.InteractiveMessage.Header.create({
          hasMediaAttachment: false,
          ...await prepareWAMessageMedia({ image: AlyaWlcm }, { upload: AlyaBotInc.waUploadToServer })
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
            "name": "quick_reply",
              "buttonParamsJson": `{\"display_text\":\"Welcome 💐\",\"id\":\"\"}`
            }],
          }),
          contextInfo: {
                  mentionedJid: [num], 
                  forwardingScore: 999,
                  isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363222395675670@newsletter',
                  newsletterName: ownername,
                  serverMessageId: 143
                }
                }
       })
    }
  }
}, {})
AlyaBotInc.relayMessage(anu.id, msgs.message, {})
                } else if (anu.action == 'remove') {
                	const alyabuffer = await getBuffer(ppuser)
                    const alyatime = moment.tz('Africa/Nairobi').format('HH:mm:ss')
	                const alyadate = moment.tz('Africa/Nairobi').format('DD/MM/YYYY')
                	let alyaName = num
                    const alyamembers = metadata.participants.length
                    alyabody = `┌─❖
│「 𝗚𝗼𝗼𝗱𝗯𝘆𝗲 👋 」
└┬❖ 「 @${alyaName.split("@")[0]}  」
   │✑  𝗟𝗲𝗳𝘁 
   │✑ ${metadata.subject}
   │✑  𝗠𝗲𝗺𝗯𝗲𝗿 : 
   │✑ ${alyamembers}th
   │✑  𝗧𝗶𝗺𝗲 : 
   │✑  ${alyatime} ${alyadate}
   └───────────────┈ ⳹`
let msgs = generateWAMessageFromContent(anu.id, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: alyabody
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: botname
          }),
          header: proto.Message.InteractiveMessage.Header.create({
          hasMediaAttachment: false,
          ...await prepareWAMessageMedia({ image: AlyaLft }, { upload: AlyaBotInc.waUploadToServer })
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
            "name": "quick_reply",
              "buttonParamsJson": `{\"display_text\":\"Goodbye 👋\",\"id\":\"\"}`
            }],
          }),
          contextInfo: {
                  mentionedJid: [num], 
                  forwardingScore: 999,
                  isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363222395675670@newsletter',
                  newsletterName: ownername,
                  serverMessageId: 143
                }
                }
       })
    }
  }
}, {})
AlyaBotInc.relayMessage(anu.id, msgs.message, {})
}
}
} catch (err) {
console.log(err)
}
}
})
// Anti Call
    AlyaBotInc.ev.on('call', async (AlyaPapa) => {
    	if (global.anticall){
    console.log(AlyaPapa)
    for (let AlyaFucks of AlyaPapa) {
    if (AlyaFucks.isGroup == true) {
    if (AlyaFucks.status == "offer") {
    let AlyaBlokMsg = await AlyaBotInc.sendTextWithMentions(AlyaFucks.from, `*${AlyaBotInc.user.name}* can't receive ${AlyaFucks.isVideo ? `video` : `voice` } call. Sorry @${AlyaFucks.from.split('@')[0]} you will be blocked. If called accidentally please contact the owner to be unblocked !`)
    AlyaBotInc.sendContact(AlyaFucks.from, owner, AlyaBlokMsg)
    await sleep(8000)
    await AlyaBotInc.updateBlockStatus(AlyaFucks.from, "block")
    }
    }
    }
    }
    })
    //autostatus view
        AlyaBotInc.ev.on('messages.upsert', async chatUpdate => {
        	if (global.antiswview){
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            	await AlyaBotInc.readMessages([mek.key]) }
            }
    })
    //admin event
    AlyaBotInc.ev.on('group-participants.update', async (anu) => {
    	if (global.adminevent){
console.log(anu)
try {
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await AlyaBotInc.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await AlyaBotInc.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
 if (anu.action == 'promote') {
const alyatime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
const alyadate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
let alyaName = num
alyabody = ` 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘀🎉 @${alyaName.split("@")[0]}, you have been *promoted* to *admin* 🥳`
   AlyaBotInc.sendMessage(anu.id,
 { text: alyabody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": AlyaWlcm,
"sourceUrl": `${wagc}`}}})
} else if (anu.action == 'demote') {
const alyatime = moment.tz('Asia/Kolkata').format('HH:mm:ss')
const alyadate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
let alyaName = num
alyabody = `𝗢𝗼𝗽𝘀‼️ @${alyaName.split("@")[0]}, you have been *demoted* from *admin* 😬`
AlyaBotInc.sendMessage(anu.id,
 { text: alyabody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": AlyaLft,
"sourceUrl": `${wagc}`}}})
}
}
} catch (err) {
console.log(err)
}
}
})

// detect group update
		AlyaBotInc.ev.on("groups.update", async (json) => {
			if (global.groupevent) {
			try {
ppgroup = await AlyaBotInc.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
			console.log(json)
			const res = json[0]
			if (res.announce == true) {
				await sleep(2000)
				AlyaBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup has been closed by admin, Now only admins can send messages !`,
				})
			} else if (res.announce == false) {
				await sleep(2000)
				AlyaBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nThe group has been opened by admin, Now participants can send messages !`,
				})
			} else if (res.restrict == true) {
				await sleep(2000)
				AlyaBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup info has been restricted, Now only admin can edit group info !`,
				})
			} else if (res.restrict == false) {
				await sleep(2000)
				AlyaBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup info has been opened, Now participants can edit group info !`,
				})
			} else if(!res.desc == ''){
				await sleep(2000)
				AlyaBotInc.sendMessage(res.id, { 
					text: `「 Group Settings Change 」\n\n*Group description has been changed to*\n\n${res.desc}`,
				})
      } else {
				await sleep(2000)
				AlyaBotInc.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\n*Group name has been changed to*\n\n*${res.subject}*`,
				})
			} 
			}
		})
		
		// respon cmd pollMessage
    async function getMessage(key){
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "Cheems Bot Here!"
        }
    }
    AlyaBotInc.ev.on('messages.update', async chatUpdate => {
        for(const { key, update } of chatUpdate) {
			if(update.pollUpdates && key.fromMe) {
				const pollCreation = await getMessage(key)
				if(pollCreation) {
				    const pollUpdate = await getAggregateVotesInPollMessage({
							message: pollCreation,
							pollUpdates: update.pollUpdates,
						})
	                var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
	                if (toCmd == undefined) return
                    var prefCmd = xprefix+toCmd
	                AlyaBotInc.appenTextMessage(prefCmd, chatUpdate)
				}
			}
		}
    })

    AlyaBotInc.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast' )
            if (!AlyaBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            const m = smsg(AlyaBotInc, mek, store)
            require("./Queenalya")(AlyaBotInc, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
   
   AlyaBotInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    AlyaBotInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = AlyaBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    AlyaBotInc.getName = (jid, withoutContact = false) => {
        id = AlyaBotInc.decodeJid(jid)
        withoutContact = AlyaBotInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = AlyaBotInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === AlyaBotInc.decodeJid(AlyaBotInc.user.id) ?
            AlyaBotInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

AlyaBotInc.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await AlyaBotInc.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await AlyaBotInc.getName(i)}\nFN:${await AlyaBotInc.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
	    })
	}
	AlyaBotInc.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

    AlyaBotInc.public = true

    AlyaBotInc.serializeM = (m) => smsg(AlyaBotInc, m, store)

    AlyaBotInc.sendText = (jid, text, quoted = '', options) => AlyaBotInc.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    AlyaBotInc.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await AlyaBotInc.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        })
    }
    AlyaBotInc.sendTextWithMentions = async (jid, text, quoted, options = {}) => AlyaBotInc.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    AlyaBotInc.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await AlyaBotInc.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

AlyaBotInc.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await AlyaBotInc.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }
    
    AlyaBotInc.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await AlyaBotInc.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

AlyaBotInc.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await AlyaBotInc.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
    AlyaBotInc.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    
    AlyaBotInc.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return AlyaBotInc.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return AlyaBotInc.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return AlyaBotInc.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return AlyaBotInc.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return AlyaBotInc.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }
      
      AlyaBotInc.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }
      
      AlyaBotInc.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await AlyaBotInc.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;

  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await AlyaBotInc.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await AlyaBotInc.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}

AlyaBotInc.cMod = (jid, copy, text = '', sender = AlyaBotInc.user.id, options = {}) => {
        //let copy = message.toJSON()
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === AlyaBotInc.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }

AlyaBotInc.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await AlyaBotInc.getFile(path, true)
           let { mime, ext, res, data, filename } = types
           if (res && res.status !== 200 || file.length <= 65536) {
               try { throw { json: JSON.parse(file.toString()) } }
               catch (e) { if (e.json) throw e.json }
           }
       let type = '', mimetype = mime, pathFile = filename
       if (options.asDocument) type = 'document'
       if (options.asSticker || /webp/.test(mime)) {
        let { writeExif } = require('./lib/exif')
        let media = { mimetype: mime, data }
        pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
        await fs.promises.unlink(filename)
        type = 'sticker'
        mimetype = 'image/webp'
        }
       else if (/image/.test(mime)) type = 'image'
       else if (/video/.test(mime)) type = 'video'
       else if (/audio/.test(mime)) type = 'audio'
       else type = 'document'
       await AlyaBotInc.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
       return fs.promises.unlink(pathFile)
       }
    
    AlyaBotInc.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await AlyaBotInc.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}
    
    AlyaBotInc.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return AlyaBotInc.sendMessage(jid, { poll: { name, values, selectableCount }}) }

AlyaBotInc.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
            
    AlyaBotInc.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    return AlyaBotInc
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})

startAlyaBotInc()

process.on('uncaughtexception', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})