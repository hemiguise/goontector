// only grabs 9000-10000 of the server's members
// find fix later

const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const path = require("path");

// === CONFIG ===
const token = 'YOUR_TOKEN_HERE'; // Discord token goes here.
const WHITELISTED_IDS = ['1363580709998035067'];

// === TRACKING ===
const detectedBots = [];

const client = new Client({ checkUpdate: false });

client.on("ready", async () => {
  console.log(`🔍 Logged in as ${client.user.tag}`);
  const guilds = client.guilds.cache;

  for (const [id, guild] of guilds) {
    try {
      await guild.members.fetch();
      const members = Array.from(guild.members.cache.values());

      // Log bots with guild ID
      const bots = members.filter(m => m.user.bot);
      bots.forEach(bot => {
        detectedBots.push({
          username: bot.user.username,
          discriminator: bot.user.discriminator,
          tag: bot.user.tag,
          id: bot.user.id,
          source: guild.name,
          guildId: guild.id
        });
      });

      // Dump only real users
      const filtered = members
        .filter(m =>
          !WHITELISTED_IDS.includes(m.id) &&
          !m.user.bot
        )
        .map(m => ({
          username: m.user.username,
          discriminator: m.user.discriminator,
          tag: m.user.tag,
          id: m.user.id,
          bot: m.user.bot
        }));

      const output = {
        serverName: guild.name,
        serverId: guild.id,
        memberCount: filtered.length,
        dumpedAt: new Date().toISOString(),
        members: filtered
      };

      const safeName = guild.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `members_${safeName}_${guild.id}.json`;
      fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(output, null, 2));

      console.log(`✅ Dumped ${filtered.length} users (no bots) from "${guild.name}"`);
    } catch (err) {
      console.error(`❌ Failed to process ${guild.name}: ${err.message}`);
    }
  }

  console.log("📦 Finished dumping all servers. Merging users...");

  // === Merge users
  const files = fs.readdirSync(__dirname).filter(f => f.startsWith('members_') && f.endsWith('.json'));
  const allMembers = [];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file));
    for (const member of data.members) {
      allMembers.push({ ...member, source: data.serverName });
    }
  }

  fs.writeFileSync('all_members.json', JSON.stringify(allMembers, null, 2));
  console.log(`📁 Combined ${allMembers.length} users into all_members.json`);

  // === Detect repeat offenders
  const seen = new Map();
  const repeatOffenders = new Map();

  for (const member of allMembers) {
    if (seen.has(member.id)) {
      if (!repeatOffenders.has(member.id)) {
        repeatOffenders.set(member.id, [seen.get(member.id)]);
      }
      repeatOffenders.get(member.id).push(member.source);
    } else {
      seen.set(member.id, member.source);
    }
  }

  const banlist = Array.from(repeatOffenders.entries()).map(([id, sources]) => ({
    id,
    sources,
    reason: 'Repeat condo server member'
  }));

  fs.writeFileSync('banlist.json', JSON.stringify(banlist, null, 2));
  console.log(`⚔️  Found ${banlist.length} repeat offenders. Saved to banlist.json`);

  // === Dump all bots
  fs.writeFileSync('detected_bots.json', JSON.stringify(detectedBots, null, 2));
  console.log(`🤖 Detected ${detectedBots.length} bots across all servers. Saved to detected_bots.json`);

  // === Bot analytics
  const botStats = new Map();
  for (const bot of detectedBots) {
    const key = bot.username;
    if (!botStats.has(key)) botStats.set(key, []);
    botStats.get(key).push(`${bot.source} (${bot.guildId})`);
  }

  console.log("🧾 Top bots detected:");
  [...botStats.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .forEach(([name, sources]) => {
      console.log(`- ${name} (seen in ${sources.length} servers)`);
      sources.forEach(s => console.log(`   ↳ ${s}`));
    });

  console.log("🧼 Goontector is complete. Have fun!");
  process.exit(0);
});

client.login(token);
