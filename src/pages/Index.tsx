import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HERO_BG = 'https://cdn.poehali.dev/projects/baa977d1-084e-4baf-a25c-b8d6ea31051c/files/f62af721-5a11-4ed5-af26-1cb2cc853b97.jpg';
const ARTIST_IMG = 'https://cdn.poehali.dev/projects/baa977d1-084e-4baf-a25c-b8d6ea31051c/files/b43cecdc-b7d9-4cc2-b781-f104036fe38f.jpg';
const RELEASE_IMG = 'https://cdn.poehali.dev/projects/baa977d1-084e-4baf-a25c-b8d6ea31051c/files/01751bf8-5519-429e-9abd-faae942d9592.jpg';

const navLinks = [
  { label: 'Артисты', href: '#artists' },
  { label: 'Релизы', href: '#releases' },
  { label: 'Дистрибьюция', href: '#distribution' },
  { label: 'О лейбле', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
];

const artists = [
  { name: 'NOVA', genre: 'Synthwave', listeners: '2.4M' },
  { name: 'KETO', genre: 'Techno', listeners: '1.8M' },
  { name: 'AURORA X', genre: 'Future Bass', listeners: '3.1M' },
  { name: 'VOID', genre: 'Dark Electro', listeners: '980K' },
];

const releases = [
  { title: 'NEON DREAMS', artist: 'NOVA', date: '12.06.2026', plays: '4.2M' },
  { title: 'PULSE', artist: 'KETO', date: '04.06.2026', plays: '2.7M' },
  { title: 'GRAVITY', artist: 'AURORA X', date: '28.05.2026', plays: '5.9M' },
];

const stats = [
  { value: '48M+', label: 'прослушиваний в месяц' },
  { value: '120+', label: 'релизов в каталоге' },
  { value: '34', label: 'артиста на лейбле' },
  { value: '90', label: 'стран охвата' },
];

const geo = [
  { country: 'Россия', percent: 38 },
  { country: 'Германия', percent: 21 },
  { country: 'США', percent: 17 },
  { country: 'Бразилия', percent: 13 },
  { country: 'Япония', percent: 11 },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <a href="#" className="font-display font-bold text-2xl tracking-[0.3em] text-glow-cyan">
            TR<span className="text-neon-cyan">O</span>N
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors uppercase tracking-wider">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-sm hover:text-neon-cyan">Войти</Button>
            <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan">Регистрация</Button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={26} />
          </button>
        </div>
        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 animate-fade-in">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground uppercase tracking-wider">
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1">Войти</Button>
              <Button className="flex-1 bg-neon-cyan text-background font-semibold">Регистрация</Button>
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 grid-bg">
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        </div>
        <div className="container relative z-10">
          <p className="text-neon-magenta uppercase tracking-[0.4em] text-sm mb-6 animate-fade-in">Музыкальный лейбл нового поколения</p>
          <h1 className="font-display font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-8 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            ЗВУК,<br />КОТОРЫЙ <span className="text-gradient">ДВИЖЕТ</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-10 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Мы находим, развиваем и продвигаем артистов электронной сцены по всему миру. Твоя музыка — наша миссия.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <Button size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan text-base">
              <Icon name="Play" size={18} className="mr-2" /> Слушать релизы
            </Button>
            <Button size="lg" variant="outline" className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-white text-base">
              Отправить демо
            </Button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-border py-4 overflow-hidden bg-card/50">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="font-display text-2xl uppercase tracking-widest flex items-center">
              {['Synthwave', 'Techno', 'House', 'Future Bass', 'Dark Electro', 'Ambient'].map((g) => (
                <span key={g} className="flex items-center">
                  <span className="px-8 text-muted-foreground">{g}</span>
                  <Icon name="Asterisk" size={20} className="text-neon-cyan" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="py-24 container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-5xl md:text-6xl text-gradient mb-2">{s.value}</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Artists */}
      <section id="artists" className="py-24 container">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display font-bold text-4xl md:text-6xl">НАШИ <span className="text-neon-cyan">АРТИСТЫ</span></h2>
          <a href="#" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors">
            Все артисты <Icon name="ArrowRight" size={18} />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((a) => (
            <div key={a.name} className="group relative overflow-hidden rounded-xl border border-border hover-scale cursor-pointer">
              <img src={ARTIST_IMG} alt={a.name} className="w-full aspect-[3/4] object-cover group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display font-bold text-2xl">{a.name}</h3>
                <p className="text-neon-magenta text-sm uppercase tracking-wider">{a.genre}</p>
                <p className="text-muted-foreground text-xs mt-2 flex items-center gap-1">
                  <Icon name="Headphones" size={14} /> {a.listeners} слушателей
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Releases */}
      <section id="releases" className="py-24 bg-card/30 border-y border-border">
        <div className="container">
          <h2 className="font-display font-bold text-4xl md:text-6xl mb-12">СВЕЖИЕ <span className="text-neon-magenta">РЕЛИЗЫ</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {releases.map((r) => (
              <div key={r.title} className="group rounded-xl overflow-hidden border border-border bg-card hover:neon-glow-cyan transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img src={RELEASE_IMG} alt={r.title} className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40">
                    <span className="w-16 h-16 rounded-full bg-neon-cyan flex items-center justify-center neon-glow-cyan">
                      <Icon name="Play" size={28} className="text-background ml-1" />
                    </span>
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-xl">{r.title}</h3>
                  <p className="text-muted-foreground text-sm">{r.artist}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{r.date}</span>
                    <span className="flex items-center gap-1"><Icon name="Play" size={12} /> {r.plays}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geo / Statistics */}
      <section className="py-24 container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-neon-cyan uppercase tracking-[0.3em] text-sm mb-4">Аналитика</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">ГЕОГРАФИЯ <br /><span className="text-gradient">СЛУШАТЕЛЕЙ</span></h2>
            <p className="text-muted-foreground mb-8">
              Музыка наших артистов звучит в 90 странах. Мы отслеживаем прослушивания в реальном времени и помогаем строить стратегию роста.
            </p>
            <div className="space-y-5">
              {geo.map((g) => (
                <div key={g.country}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{g.country}</span>
                    <span className="text-neon-cyan font-semibold">{g.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta" style={{ width: `${g.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'TrendingUp', value: '+24%', label: 'рост за месяц' },
              { icon: 'Clock', value: '3:42', label: 'среднее прослушивание' },
              { icon: 'Repeat', value: '68%', label: 'повторных прослушиваний' },
              { icon: 'Users', value: '12.4M', label: 'уникальных слушателей' },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-6 hover:border-neon-cyan transition-colors animate-float" style={{ animationDelay: `${Math.random()}s` }}>
                <Icon name={c.icon} size={28} className="text-neon-magenta mb-4" />
                <div className="font-display font-bold text-3xl">{c.value}</div>
                <div className="text-muted-foreground text-xs">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution */}
      <section id="distribution" className="py-24 bg-card/30 border-y border-border">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-neon-magenta uppercase tracking-[0.3em] text-sm mb-4">Дистрибьюция</p>
            <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">МУЗЫКА НА <span className="text-neon-cyan">ВСЕХ</span> ПЛОЩАДКАХ</h2>
            <p className="text-muted-foreground">Загружай треки один раз — мы доставим их в Spotify, Apple Music, VK, Яндекс Музыку и ещё 150+ сервисов по всему миру.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: 'Globe', title: '150+ платформ', text: 'Глобальный охват в один клик' },
              { icon: 'BadgePercent', title: '85% роялти', text: 'Ты оставляешь себе большую часть' },
              { icon: 'ShieldCheck', title: 'Защита прав', text: 'Контроль контента и монетизация' },
            ].map((d) => (
              <div key={d.title} className="rounded-xl border border-border bg-background p-8 text-center hover:neon-glow-magenta transition-all">
                <span className="inline-flex w-14 h-14 rounded-full bg-neon-magenta/15 items-center justify-center mb-5">
                  <Icon name={d.icon} size={26} className="text-neon-magenta" />
                </span>
                <h3 className="font-display font-bold text-xl mb-2">{d.title}</h3>
                <p className="text-muted-foreground text-sm">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={HERO_BG} alt="О лейбле" className="rounded-2xl border border-border" />
            <div className="absolute -bottom-6 -right-6 bg-neon-cyan text-background rounded-xl p-6 neon-glow-cyan hidden md:block">
              <div className="font-display font-bold text-4xl">2018</div>
              <div className="text-xs uppercase tracking-wider">год основания</div>
            </div>
          </div>
          <div>
            <p className="text-neon-cyan uppercase tracking-[0.3em] text-sm mb-4">О лейбле</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">МЫ СОЗДАЁМ <span className="text-gradient">БУДУЩЕЕ</span> ЗВУКА</h2>
            <p className="text-muted-foreground mb-4">
              TRON — независимый лейбл, объединяющий смелых электронных артистов. Мы верим, что музыка не имеет границ, а технологии помогают находить своего слушателя.
            </p>
            <p className="text-muted-foreground mb-8">
              От первого демо до мирового релиза — мы рядом на каждом этапе: продакшн, продвижение, дистрибьюция и аналитика.
            </p>
            <div className="flex gap-8">
              {[['34', 'артиста'], ['8', 'лет на сцене'], ['120+', 'релизов']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display font-bold text-3xl text-neon-magenta">{v}</div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section className="py-24 container">
        <div className="relative rounded-3xl overflow-hidden border border-border grid-bg p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-magenta/10" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-6xl mb-4">БУДЬ В <span className="text-gradient">ПОТОКЕ</span></h2>
            <p className="text-muted-foreground mb-8">Подпишись на рассылку — новые релизы, эксклюзивы и анонсы раньше всех.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="Твой email" className="bg-background/80 border-border h-12" />
              <Button type="submit" size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan whitespace-nowrap">
                Подписаться
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Contacts / Footer */}
      <footer id="contacts" className="border-t border-border pt-20 pb-10">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-10 mb-16">
            <div className="md:col-span-2">
              <div className="font-display font-bold text-3xl tracking-[0.3em] mb-4 text-glow-cyan">TR<span className="text-neon-cyan">O</span>N</div>
              <p className="text-muted-foreground max-w-sm">Музыкальный лейбл нового поколения. Звук, который движет мир вперёд.</p>
              <div className="flex gap-4 mt-6">
                {['Instagram', 'Youtube', 'Send', 'Music'].map((s) => (
                  <a key={s} href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-neon-cyan hover:text-neon-cyan transition-colors">
                    <Icon name={s} size={18} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display uppercase tracking-wider text-sm mb-4 text-muted-foreground">Навигация</h4>
              <ul className="space-y-3">
                {navLinks.map((l) => (
                  <li key={l.label}><a href={l.href} className="hover:text-neon-cyan transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display uppercase tracking-wider text-sm mb-4 text-muted-foreground">Контакты</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2"><Icon name="Mail" size={16} className="text-neon-cyan" /> hello@tron.label</li>
                <li className="flex items-center gap-2"><Icon name="Phone" size={16} className="text-neon-cyan" /> +7 (999) 000-00-00</li>
                <li className="flex items-center gap-2"><Icon name="MapPin" size={16} className="text-neon-cyan" /> Москва</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground">
            <span>© 2026 TRON Records. Все права защищены.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-neon-cyan transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Условия</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
