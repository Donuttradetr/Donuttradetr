import { Cookie, Shield, Zap, Users, ArrowRight, CheckCircle, Lock, Bot, Database } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Secure Escrow',
      description: 'Funds are held safely until delivery is confirmed by our admin team.',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: Zap,
      title: 'Instant Trades',
      description: 'Create listings, purchase items, and trade securely in minutes.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Bot,
      title: 'Automated Bot',
      description: 'Mineflayer bot handles deposits and deliveries automatically.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Database,
      title: 'Real-time Sync',
      description: 'PostgreSQL database keeps everything in sync across platforms.',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ];

  const steps = [
    { num: '01', title: 'Register', desc: 'Create account with your Minecraft username' },
    { num: '02', title: 'Deposit', desc: 'Send in-game currency to our bank bot' },
    { num: '03', title: 'Trade', desc: 'Buy or sell items on the marketplace' },
    { num: '04', title: 'Receive', desc: 'Admin confirms delivery, funds released' },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-purple rounded-full text-sm font-medium text-purple-300">
          <Lock className="w-4 h-4" />
          Trusted Minecraft Escrow Platform
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          <span className="text-white">Trade Safely.</span>
          <br />
          <span className="gradient-text">Never Get Scammed.</span>
        </h1>
        
        <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          DonutTrade provides a secure escrow system for Minecraft players. 
          Trade items and currency with complete confidence using our admin-verified platform.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('register')}
            className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
          >
            Start Trading
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="btn-secondary text-lg px-8 py-4"
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 pt-8">
          {[
            { value: '10K+', label: 'Trades Completed' },
            { value: '$2M+', label: 'Volume Secured' },
            { value: '99.9%', label: 'Success Rate' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-white/60">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="glass-card rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-white/60">Four simple steps to secure trading</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < 3 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
              )}
              <div className="text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 text-white text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                  {step.num}
                </div>
                <h4 className="font-bold text-white text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-white/60">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Escrow Explanation */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl" />
        <div className="glass-purple rounded-3xl p-8 md:p-12 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <Lock className="w-10 h-10 text-purple-400" />
                What is Escrow?
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                When a buyer makes a payment, the funds don't go directly to the seller. 
                They're held securely in our escrow system. Once an admin verifies the 
                in-game item delivery, the payment is released to the seller.
              </p>
              <ul className="space-y-4">
                {[
                  'Funds are protected throughout the transaction',
                  'No payment until items are delivered',
                  'Every trade is verified by our admin team',
                  'Full refund if delivery fails',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 glass rounded-3xl flex items-center justify-center animate-float">
                <Cookie className="w-32 h-32 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center glass-card rounded-3xl p-12">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to trade safely?
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Join thousands of Minecraft players who trust DonutTrade for secure trading.
        </p>
        <button
          onClick={() => onNavigate('register')}
          className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
        >
          Create Free Account
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-white/40 text-sm pt-8 border-t border-white/5">
        <p>© 2024 DonutTrade — Secure Minecraft Escrow Platform</p>
        <p className="mt-2">Built with Next.js, Tailwind CSS, and PostgreSQL</p>
      </footer>
    </div>
  );
}
