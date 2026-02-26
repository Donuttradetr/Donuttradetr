import { Server, Database, Bot, Globe, ArrowRight, ArrowDown, Shield, Zap, CheckCircle } from 'lucide-react';

export function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">🏗️ System Architecture</h1>
        <p className="text-white/60">High-level overview of DonutTrade infrastructure</p>
      </div>

      {/* Architecture Diagram */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-white mb-6 text-center">Real-time Communication Flow</h2>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Frontend */}
          <div className="glass-purple rounded-2xl p-6 w-64 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-white mb-2">Web Frontend</h3>
            <p className="text-white/60 text-sm">Next.js + Tailwind CSS</p>
            <div className="mt-4 space-y-2 text-xs text-white/50">
              <p>• User Dashboard</p>
              <p>• Marketplace UI</p>
              <p>• Admin Panel</p>
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-purple-400 hidden lg:block" />
          <ArrowDown className="w-8 h-8 text-purple-400 lg:hidden" />

          {/* Backend */}
          <div className="glass-purple rounded-2xl p-6 w-64 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Server className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-white mb-2">Backend API</h3>
            <p className="text-white/60 text-sm">Node.js + Express</p>
            <div className="mt-4 space-y-2 text-xs text-white/50">
              <p>• REST API Endpoints</p>
              <p>• Authentication (JWT)</p>
              <p>• Business Logic</p>
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-purple-400 hidden lg:block" />
          <ArrowDown className="w-8 h-8 text-purple-400 lg:hidden" />

          {/* Database */}
          <div className="glass-purple rounded-2xl p-6 w-64 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-white mb-2">Database</h3>
            <p className="text-white/60 text-sm">PostgreSQL</p>
            <div className="mt-4 space-y-2 text-xs text-white/50">
              <p>• Users & Auth</p>
              <p>• Listings & Trades</p>
              <p>• Transaction History</p>
            </div>
          </div>
        </div>

        {/* Bot Integration */}
        <div className="mt-8 flex justify-center">
          <div className="glass rounded-2xl p-6 w-80 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-white mb-2">Minecraft Bot</h3>
            <p className="text-white/60 text-sm">Mineflayer + Microsoft Auth</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/50">
              <p>• Auto-reconnect</p>
              <p>• Chat Monitoring</p>
              <p>• Item Handling</p>
              <p>• API Sync</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Technology Stack
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Frontend', tech: 'Next.js 14, React 18, Tailwind CSS', color: 'bg-blue-500' },
              { name: 'Backend', tech: 'Node.js, Express.js, TypeScript', color: 'bg-green-500' },
              { name: 'Database', tech: 'PostgreSQL, Prisma ORM', color: 'bg-purple-500' },
              { name: 'Auth', tech: 'JWT, bcrypt, MSAL (Bot)', color: 'bg-amber-500' },
              { name: 'Bot', tech: 'Mineflayer, prismarine-auth', color: 'bg-pink-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-lg p-3">
                <div className={`w-3 h-3 ${item.color} rounded-full`} />
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{item.name}</p>
                  <p className="text-white/50 text-xs">{item.tech}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Security Features
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Escrow System', desc: 'Funds held until delivery confirmed' },
              { name: 'JWT Authentication', desc: 'Secure token-based auth' },
              { name: 'Password Hashing', desc: 'bcrypt with salt rounds' },
              { name: 'Input Validation', desc: 'Zod schema validation' },
              { name: 'Rate Limiting', desc: 'API request throttling' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-lg p-3">
                <p className="font-medium text-white text-sm">{item.name}</p>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloudflare Deployment Guide */}
      <div className="glass-card rounded-2xl p-8 border-2 border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Globe className="w-6 h-6 text-purple-400" />
          Cloudflare Deployment Guide
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-white">1. Site Hosting (Cloudflare Pages)</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                Connect your GitHub repository to Cloudflare Pages.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                Build Command: <code className="bg-black/40 px-1 rounded text-purple-300">npm run build</code>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                Output Directory: <code className="bg-black/40 px-1 rounded text-purple-300">dist</code>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                SPA Routing: Handled by <code className="bg-black/40 px-1 rounded text-purple-300">_redirects</code> file.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">2. Backend & Security</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                Enable <strong>DDoS Protection</strong> in Cloudflare Dashboard.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                Configure <strong>WAF Rules</strong> to block malicious traffic.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                Use <strong>Cloudflare Tunnel</strong> to connect your local Bot API.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">📡 Core API Endpoints</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/50 border-b border-white/10">
                <th className="text-left py-3 px-4">Method</th>
                <th className="text-left py-3 px-4">Endpoint</th>
                <th className="text-left py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {[
                { method: 'POST', endpoint: '/api/auth/register', desc: 'User registration' },
                { method: 'POST', endpoint: '/api/auth/login', desc: 'User authentication' },
                { method: 'GET', endpoint: '/api/listings', desc: 'Get all active listings' },
                { method: 'POST', endpoint: '/api/listings', desc: 'Create new listing' },
                { method: 'POST', endpoint: '/api/transactions', desc: 'Initiate escrow purchase' },
                { method: 'PATCH', endpoint: '/api/transactions/:id', desc: 'Complete/cancel trade' },
                { method: 'POST', endpoint: '/api/deposits', desc: 'Request balance deposit' },
                { method: 'POST', endpoint: '/api/bot/deposit', desc: 'Bot reports payment received' },
              ].map((item, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      item.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      item.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-purple-300">{item.endpoint}</td>
                  <td className="py-3 px-4">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
