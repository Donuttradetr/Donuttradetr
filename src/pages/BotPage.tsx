import { useState } from 'react';
import { Bot, PlugZap, MessageSquare, Package, Shield, Copy, CheckCircle2, Key, RefreshCw } from 'lucide-react';

export function BotPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const botCode = `// DonutTrade Bot - Mineflayer + Microsoft Auth
// Required: Node.js 18+, npm packages below

import mineflayer from 'mineflayer';
import { pathfinder } from 'mineflayer-pathfinder';
import { Authflow } from 'prismarine-auth';
import axios from 'axios';

const CONFIG = {
  host: 'play.donutsmp.net',
  port: 25565,
  version: '1.20.1',
  auth: 'microsoft',
  profilesFolder: './auth_cache',
  apiUrl: process.env.API_URL || 'http://localhost:3001/api',
  apiKey: process.env.BOT_API_KEY,
};

let bot: mineflayer.Bot | null = null;

// Microsoft Authentication Flow
const authFlow = new Authflow('DonutBankBot', CONFIG.profilesFolder, {
  flow: 'msal',
  authTitle: '00000000402b5328', // Minecraft client ID
});

async function createBot() {
  console.log('[BOT] Starting Microsoft authentication...');
  
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    version: CONFIG.version,
    auth: CONFIG.auth,
    profilesFolder: CONFIG.profilesFolder,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('[BOT] Successfully connected to server!');
    console.log(\`[BOT] Logged in as: \${bot?.username}\`);
  });

  // Anti-AFK: Jump periodically
  setInterval(() => {
    if (bot?.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot?.setControlState('jump', false), 200);
    }
  }, 60000);

  // Chat listener for payment detection
  bot.on('chat', async (username, message) => {
    // Regex for payment messages (adjust for your server format)
    const paymentRegex = /(\\w+) has paid you \\$([\\d,]+)/i;
    const match = message.match(paymentRegex);

    if (match) {
      const sender = match[1];
      const amount = parseInt(match[2].replace(/,/g, ''), 10);
      
      console.log(\`[BOT] Payment received: \${sender} sent $\${amount}\`);
      
      // Send to API
      try {
        await axios.post(\`\${CONFIG.apiUrl}/bot/deposit\`, {
          username: sender,
          amount: amount,
        }, {
          headers: { 'X-Bot-Key': CONFIG.apiKey }
        });
        console.log('[BOT] Deposit recorded in database');
      } catch (err) {
        console.error('[BOT] API Error:', err);
      }
    }
  });

  // Item pickup detection
  bot.on('playerCollect', async (collector, collected) => {
    if (collector.username === bot?.username) {
      const item = collected.getDroppedItem();
      if (item) {
        console.log(\`[BOT] Collected: \${item.name} x\${item.count}\`);
        // Report to API for item deposits
      }
    }
  });

  // Auto-reconnect on disconnect
  bot.on('end', (reason) => {
    console.log(\`[BOT] Disconnected: \${reason}\`);
    console.log('[BOT] Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.error('[BOT] Error:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('[BOT] Kicked:', reason);
  });
}

// Delivery command handler (called by API)
async function deliverItem(playerName: string, itemName: string, quantity: number) {
  if (!bot) return { success: false, error: 'Bot not connected' };
  
  // Find item in inventory
  const item = bot.inventory.items().find(i => 
    i.name.toLowerCase().includes(itemName.toLowerCase())
  );
  
  if (!item) {
    return { success: false, error: 'Item not found in inventory' };
  }
  
  // Find player
  const player = bot.players[playerName];
  if (!player?.entity) {
    return { success: false, error: 'Player not nearby' };
  }
  
  // Toss item to player (simplified)
  await bot.tossStack(item);
  return { success: true };
}

// Start the bot
createBot();`;

  const envExample = `# .env file
DATABASE_URL="postgresql://user:password@localhost:5432/donuttrade"
BOT_API_KEY="your-secure-api-key-here"
API_URL="http://localhost:3001/api"`;

  const packageJson = `{
  "name": "donut-bot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node --loader ts-node/esm src/bot.ts",
    "dev": "tsx watch src/bot.ts"
  },
  "dependencies": {
    "mineflayer": "^4.14.0",
    "mineflayer-pathfinder": "^2.4.5",
    "prismarine-auth": "^2.4.2",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0"
  }
}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">🤖 Mineflayer Bot Setup</h1>
        <p className="text-white/60">Automated in-game bot for deposits and deliveries</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: PlugZap, title: 'Auto-Connect', desc: 'Reconnects automatically on disconnect', gradient: 'from-blue-500 to-cyan-500' },
          { icon: Key, title: 'Microsoft Auth', desc: 'Official authentication via MSAL', gradient: 'from-violet-500 to-purple-500' },
          { icon: MessageSquare, title: 'Chat Monitor', desc: 'Detects payments via regex', gradient: 'from-amber-500 to-orange-500' },
          { icon: Package, title: 'Item Handler', desc: 'Receives and delivers items', gradient: 'from-emerald-500 to-green-500' },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 hover:scale-105 transition-all duration-300">
            <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-white/60">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Setup Steps */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-400" />
          Quick Setup Guide
        </h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Create project folder', cmd: 'mkdir donut-bot && cd donut-bot' },
            { step: 2, title: 'Initialize npm project', cmd: 'npm init -y' },
            { step: 3, title: 'Install dependencies', cmd: 'npm install mineflayer mineflayer-pathfinder prismarine-auth axios' },
            { step: 4, title: 'Install dev dependencies', cmd: 'npm install -D typescript tsx @types/node' },
            { step: 5, title: 'Create bot.ts file', cmd: 'touch src/bot.ts' },
            { step: 6, title: 'Run the bot', cmd: 'npx tsx src/bot.ts' },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.title}</p>
                <code className="text-purple-300 text-sm bg-black/30 px-2 py-1 rounded mt-1 inline-block">
                  {item.cmd}
                </code>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Package.json */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            package.json
          </h3>
          <button
            onClick={() => handleCopy(packageJson, 'pkg')}
            className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-2"
          >
            {copied === 'pkg' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === 'pkg' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="glass rounded-xl p-4 overflow-x-auto">
          <pre className="text-sm text-white/80 font-mono">{packageJson}</pre>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            .env (Environment Variables)
          </h3>
          <button
            onClick={() => handleCopy(envExample, 'env')}
            className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-2"
          >
            {copied === 'env' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === 'env' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="glass rounded-xl p-4 overflow-x-auto">
          <pre className="text-sm text-white/80 font-mono">{envExample}</pre>
        </div>
      </div>

      {/* Bot Code */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-400" />
            src/bot.ts (Full Bot Code)
          </h3>
          <button
            onClick={() => handleCopy(botCode, 'bot')}
            className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-2"
          >
            {copied === 'bot' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === 'bot' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="glass rounded-xl p-4 overflow-x-auto max-h-[500px]">
          <pre className="text-sm text-white/80 font-mono whitespace-pre-wrap">{botCode}</pre>
        </div>
      </div>

      {/* Example Admin Account */}
      <div className="glass-card rounded-2xl p-6 border-2 border-amber-500/30">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          👑 Örnek Admin Hesabı (Demo)
        </h3>
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50 text-sm mb-1">Kullanıcı Adı:</p>
              <p className="text-white font-bold text-lg">Kebapseverim_</p>
            </div>
            <div>
              <p className="text-white/50 text-sm mb-1">Şifre:</p>
              <p className="text-white font-bold text-lg">123</p>
            </div>
            <div className="col-span-2">
              <p className="text-white/50 text-sm mb-1">Email:</p>
              <p className="text-white font-medium">admin@donuttrade.com</p>
            </div>
          </div>
          <p className="text-amber-300/70 text-xs mt-4">
            ⚠️ Bu sadece demo içindir. Gerçek ortamda güçlü şifre kullanın!
          </p>
        </div>
      </div>

      {/* Cloudflare Tunnel Integration */}
      <div className="glass-card rounded-2xl p-6 border-2 border-blue-500/30">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <PlugZap className="w-5 h-5 text-blue-400" />
          How to connect Local Bot to Cloudflare
        </h3>
        <div className="space-y-4 text-sm text-white/70">
          <p>Since your bot runs on your local PC and the site is on Cloudflare, follow these steps:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4">
              <p className="text-white font-bold mb-2">Option A: Cloudflare Tunnel (Best)</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Install <code className="text-blue-300">cloudflared</code> on your PC.</li>
                <li>Run: <code className="text-blue-300">cloudflared tunnel --url http://localhost:3001</code></li>
                <li>Cloudflare gives you a URL (e.g. <code className="text-blue-300">bot.yourdomain.com</code>).</li>
                <li>Set this as <code className="text-blue-300">API_URL</code> in your bot's .env file.</li>
              </ol>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-white font-bold mb-2">Option B: Direct Public API</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Host your API on a VPS with a public IP.</li>
                <li>Use Cloudflare DNS to point to that IP.</li>
                <li>Use the public URL in your bot settings.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="glass-purple rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">⚠️ Important Notes</h3>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            First run will open Microsoft login in browser for authentication
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            Auth tokens are cached in <code className="bg-black/30 px-1 rounded">./auth_cache</code> folder
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            Adjust the payment regex to match your server's chat format
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            Keep the bot account whitelisted on your Minecraft server
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            Use PM2 or systemd for production deployment to keep bot running 24/7
          </li>
        </ul>
      </div>
    </div>
  );
}
