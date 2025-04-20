> :trollface: cleaning up the filth
> ~~:trollface:~~
# 🧼 Goontector

**Scrapes users from NSFW/condo Roblox Discord servers so you can purge them from yours.**  
Requires a **disposable Discord alt** and Node.js 16+.

> ⚠️ Selfbot. Violates Discord ToS.  
> Use at your own risk. VPN + alt account highly recommended.  
> I do NOT condone NSFW or Roblox NSFW servers.  
> This exists to help server owners identify and remove gooners.

> ❌ Does not auto-join servers  
> ❌ Does not verify Roblox accounts  
> ✅ Only analyzes servers you're already in

---

## ⚙️ Features

- 🔍 Dumps real (non-bot) users from all servers your alt is in
- 🚫 Ignores bots (Dyno, MEE6, etc.) (Also ignores the server's other custom bots)
- 🧠 Skips whitelisted IDs (like your alt's ID)
- 📁 Merges data into `all_members.json`
- ⚔️ Builds `banlist.json` of users in multiple servers
- 🤖 Logs bots into `detected_bots.json` with server + guild ID

---

## 🚀 Setup

```bash
git clone https://github.com/hemiguise/goontector.git
cd goontector
npm install discord.js-selfbot-v13
```

Edit `goon.js` and add your token + whitelist (if you wanna avoid flagging your alt as a gooner, is optional):

```js
const token = 'YOUR_TOKEN_HERE';
const WHITELISTED_IDS = ['id, another-id'];
```

---

## ✅ Run It

```bash
node goon.js
```

---

## 📂 Output

| File                 | Description                                 |
|----------------------|---------------------------------------------|
| `all_members.json`   | Full list of real users                     |
| `banlist.json`       | Users in 2+ condo servers (repeat offenders)|
| `detected_bots.json` | List of bots + which servers they were in  |
| `members_*.json`     | Individual server dumps                     |

---

## 🧠 Use Cases

- Purging gooners and possible pedophiles (not confirmed) from your community
- Not sure yet.

---

## ❌ Not For

- Harassment  
- False bans  
- Roblox game ("experience") API integration (I have no idea how.)

---

## ⚖️ Disclaimer

This is a selfbot. It breaks Discord ToS.  
**You're responsible for how you use it.**

also please, feel free to contribute
