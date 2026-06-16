import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const HERO_BG = 'https://cdn.poehali.dev/projects/baa977d1-084e-4baf-a25c-b8d6ea31051c/files/f62af721-5a11-4ed5-af26-1cb2cc853b97.jpg';
const RELEASE_IMG = 'https://cdn.poehali.dev/projects/baa977d1-084e-4baf-a25c-b8d6ea31051c/files/01751bf8-5519-429e-9abd-faae942d9592.jpg';

const API = {
  auth: 'https://functions.poehali.dev/4832e020-8683-46ae-bbc1-aaeb30bbb0a1',
  demo: 'https://functions.poehali.dev/2b6be537-aba7-4a0e-ae11-d79a4c5b7cda',
  subscribe: 'https://functions.poehali.dev/c010db1c-a5b2-4334-b6e6-56ad2e955fc7',
  artists: 'https://functions.poehali.dev/b5975251-49e7-47ac-a362-75a729e791d5',
};

const navLinks = [
  { label: 'Артисты', href: '#artists' },
  { label: 'Релизы', href: '#releases' },
  { label: 'Дистрибьюция', href: '#distribution' },
  { label: 'О лейбле', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
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

type ModalType = 'login' | 'register' | 'demo' | null;

interface Artist {
  id: number;
  artist_name: string;
  genre: string;
  bio: string;
  photo_url: string;
}

const Field = ({ label, id, name, type = 'text', placeholder = '', required = false }: {
  label: string; id: string; name: string; type?: string; placeholder?: string; required?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm text-foreground/80">{label}{required && <span className="text-neon-magenta ml-1">*</span>}</Label>
    <Input id={id} name={name} type={type} placeholder={placeholder} required={required}
      className="bg-background/60 border-border focus:border-neon-cyan transition-colors" />
  </div>
);

export default function Index() {
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch(API.artists)
      .then(r => r.json())
      .then(d => setArtists(d.artists || []))
      .catch(() => {});
  }, []);

  const post = async (url: string, body: object) => {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { ok: r.ok, data: await r.json(), status: r.status };
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string> = { action: modal! };
    fd.forEach((v, k) => { body[k] = v as string; });

    const { ok, data, status } = await post(API.auth, body);
    setLoading(false);

    if (ok) {
      if (modal === 'register') {
        toast({ title: '🎵 Добро пожаловать в TRON!', description: 'Аккаунт создан. Ожидай подтверждения от команды лейбла.' });
      } else {
        setUser({ first_name: data.first_name, last_name: data.last_name });
        toast({ title: `Привет, ${data.first_name}!`, description: 'Ты вошёл в свой аккаунт.' });
      }
      setModal(null);
      formRef.current?.reset();
    } else {
      if (status === 409) toast({ title: 'Этот email уже зарегистрирован', description: 'Попробуй войти.', variant: 'destructive' });
      else toast({ title: 'Ошибка', description: data.error || 'Попробуй ещё раз', variant: 'destructive' });
    }
  };

  const handleDemo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string> = {};
    fd.forEach((v, k) => { body[k] = v as string; });

    const { ok, data } = await post(API.demo, body);
    setLoading(false);

    if (ok) {
      toast({ title: '🎧 Демо отправлено!', description: 'A&R команда TRON рассмотрит твою заявку в течение 7 дней.' });
      setModal(null);
      formRef.current?.reset();
    } else {
      toast({ title: 'Ошибка', description: data.error || 'Попробуй ещё раз', variant: 'destructive' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setSubscribeLoading(true);
    const { ok, data } = await post(API.subscribe, { email: subscribeEmail });
    setSubscribeLoading(false);

    if (ok) {
      if (data.already) toast({ title: 'Ты уже подписан!', description: 'Следи за релизами на почте.' });
      else toast({ title: '📬 Подписка оформлена!', description: 'Новые релизы и эксклюзивы будут приходить тебе первым.' });
      setSubscribeEmail('');
    } else {
      toast({ title: 'Ошибка', description: data.error || 'Укажи корректный email', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">

      {/* ── Header ── */}
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
            {user ? (
              <span className="text-sm text-neon-cyan font-semibold">{user.first_name} {user.last_name}</span>
            ) : (
              <>
                <Button variant="ghost" className="text-sm hover:text-neon-cyan" onClick={() => setModal('login')}>Войти</Button>
                <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan" onClick={() => setModal('register')}>Регистрация</Button>
              </>
            )}
          </div>
          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={26} />
          </button>
        </div>
        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 animate-fade-in bg-background/95">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground uppercase tracking-wider">
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => { setMenuOpen(false); setModal('login'); }}>Войти</Button>
              <Button className="flex-1 bg-neon-cyan text-background font-semibold" onClick={() => { setMenuOpen(false); setModal('register'); }}>Регистрация</Button>
            </div>
          </nav>
        )}
      </header>

      {/* ── Hero ── */}
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
            <Button size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan text-base" onClick={() => document.getElementById('releases')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="Play" size={18} className="mr-2" /> Слушать релизы
            </Button>
            <Button size="lg" variant="outline" className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-white text-base" onClick={() => setModal('demo')}>
              Отправить демо
            </Button>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
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

      {/* ── Stats ── */}
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

      {/* ── Artists ── */}
      <section id="artists" className="py-24 bg-card/30 border-y border-border">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-neon-magenta uppercase tracking-[0.3em] text-sm mb-2">Лейбл</p>
              <h2 className="font-display font-bold text-4xl md:text-6xl">НАШИ <span className="text-neon-cyan">АРТИСТЫ</span></h2>
            </div>
          </div>

          {artists.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background/40 p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-6">
                <Icon name="Music2" size={36} className="text-neon-cyan/60" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">Скоро здесь появятся артисты</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Раздел обновляется. Артисты появятся здесь после регистрации и одобрения командой TRON.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold" onClick={() => setModal('register')}>
                  <Icon name="UserPlus" size={16} className="mr-2" /> Стать артистом TRON
                </Button>
                <Button variant="outline" className="border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-white" onClick={() => setModal('demo')}>
                  Отправить демо
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artists.map((a) => (
                <div key={a.id} className="group relative overflow-hidden rounded-xl border border-border hover-scale cursor-pointer bg-card">
                  {a.photo_url ? (
                    <img src={a.photo_url} alt={a.artist_name} className="w-full aspect-[3/4] object-cover group-hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 flex items-center justify-center">
                      <Icon name="Mic2" size={48} className="text-neon-cyan/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-bold text-2xl">{a.artist_name}</h3>
                    {a.genre && <p className="text-neon-magenta text-sm uppercase tracking-wider">{a.genre}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Releases ── */}
      <section id="releases" className="py-24 container">
        <h2 className="font-display font-bold text-4xl md:text-6xl mb-12">СВЕЖИЕ <span className="text-neon-magenta">РЕЛИЗЫ</span></h2>
        <div className="grid md:grid-cols-3 gap-6">
          {releases.map((r) => (
            <div key={r.title} className="group rounded-xl overflow-hidden border border-border bg-card hover:neon-glow-cyan transition-all duration-300">
              <div className="relative overflow-hidden">
                <img src={RELEASE_IMG} alt={r.title} className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40">
                  <span className="w-16 h-16 rounded-full bg-neon-cyan flex items-center justify-center neon-glow-cyan">
                    <Icon name="Play" size={28} className="text-background ml-1" />
                  </span>
                </div>
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
      </section>

      {/* ── Geo / Statistics ── */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-neon-cyan uppercase tracking-[0.3em] text-sm mb-4">Аналитика</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">ГЕОГРАФИЯ <br /><span className="text-gradient">СЛУШАТЕЛЕЙ</span></h2>
            <p className="text-muted-foreground mb-8">Музыка наших артистов звучит в 90 странах. Мы отслеживаем прослушивания в реальном времени и помогаем строить стратегию роста.</p>
            <div className="space-y-5">
              {geo.map((g) => (
                <div key={g.country}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{g.country}</span>
                    <span className="text-neon-cyan font-semibold">{g.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-1000" style={{ width: `${g.percent}%` }} />
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
              <div key={c.label} className="rounded-xl border border-border bg-card p-6 hover:border-neon-cyan transition-colors">
                <Icon name={c.icon} size={28} className="text-neon-magenta mb-4" />
                <div className="font-display font-bold text-3xl">{c.value}</div>
                <div className="text-muted-foreground text-xs">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Distribution ── */}
      <section id="distribution" className="py-24 container">
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
            <div key={d.title} className="rounded-xl border border-border bg-card p-8 text-center hover:neon-glow-magenta transition-all">
              <span className="inline-flex w-14 h-14 rounded-full bg-neon-magenta/15 items-center justify-center mb-5">
                <Icon name={d.icon} size={26} className="text-neon-magenta" />
              </span>
              <h3 className="font-display font-bold text-xl mb-2">{d.title}</h3>
              <p className="text-muted-foreground text-sm">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24 bg-card/30 border-y border-border">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={HERO_BG} alt="О лейбле" className="rounded-2xl border border-border w-full" />
            <div className="absolute -bottom-6 -right-6 bg-neon-cyan text-background rounded-xl p-6 neon-glow-cyan hidden md:block">
              <div className="font-display font-bold text-4xl">2018</div>
              <div className="text-xs uppercase tracking-wider">год основания</div>
            </div>
          </div>
          <div>
            <p className="text-neon-cyan uppercase tracking-[0.3em] text-sm mb-4">О лейбле</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">МЫ СОЗДАЁМ <span className="text-gradient">БУДУЩЕЕ</span> ЗВУКА</h2>
            <p className="text-muted-foreground mb-4">TRON — независимый лейбл, объединяющий смелых электронных артистов. Мы верим, что музыка не имеет границ, а технологии помогают находить своего слушателя.</p>
            <p className="text-muted-foreground mb-8">От первого демо до мирового релиза — мы рядом на каждом этапе: продакшн, продвижение, дистрибьюция и аналитика.</p>
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

      {/* ── Subscribe ── */}
      <section className="py-24 container">
        <div className="relative rounded-3xl overflow-hidden border border-border grid-bg p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-magenta/10" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-6xl mb-4">БУДЬ В <span className="text-gradient">ПОТОКЕ</span></h2>
            <p className="text-muted-foreground mb-8">Подпишись на рассылку — новые релизы, эксклюзивы и анонсы раньше всех.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Твой email"
                value={subscribeEmail}
                onChange={e => setSubscribeEmail(e.target.value)}
                className="bg-background/80 border-border h-12"
                required
              />
              <Button type="submit" size="lg" disabled={subscribeLoading} className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan whitespace-nowrap">
                {subscribeLoading ? 'Отправка...' : 'Подписаться'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer / Contacts ── */}
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

      {/* ── Modal: Login ── */}
      <Dialog open={modal === 'login'} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Вход</DialogTitle>
            <DialogDescription>Войди в личный кабинет артиста TRON</DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleAuth} className="space-y-4 mt-2">
            <Field label="Email" id="email" name="email" type="email" placeholder="your@email.com" required />
            <Field label="Пароль" id="password" name="password" type="password" required />
            <Button type="submit" disabled={loading} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan">
              {loading ? 'Входим...' : 'Войти'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <button onClick={() => setModal('register')} className="text-neon-cyan hover:underline">Регистрация</button>
          </p>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Register ── */}
      <Dialog open={modal === 'register'} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="bg-card border-border sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Регистрация</DialogTitle>
            <DialogDescription>Создай аккаунт и начни сотрудничество с TRON</DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleAuth} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Фамилия" id="last_name" name="last_name" required />
              <Field label="Имя" id="first_name" name="first_name" required />
            </div>
            <Field label="Отчество" id="middle_name" name="middle_name" />
            <Field label="Псевдоним / название группы" id="artist_name" name="artist_name" placeholder="NOVA, Dark Pulse..." />
            <Field label="Жанр" id="genre" name="genre" placeholder="Techno, Synthwave..." />
            <Field label="Email" id="email" name="email" type="email" placeholder="your@email.com" required />
            <Field label="Пароль" id="password" name="password" type="password" required />
            <Button type="submit" disabled={loading} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan">
              {loading ? 'Создаём аккаунт...' : 'Создать аккаунт'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Уже с нами?{' '}
            <button onClick={() => setModal('login')} className="text-neon-cyan hover:underline">Войти</button>
          </p>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Demo ── */}
      <Dialog open={modal === 'demo'} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Отправить демо</DialogTitle>
            <DialogDescription>A&R команда TRON рассматривает каждую заявку лично</DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleDemo} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Фамилия" id="d_last_name" name="last_name" required />
              <Field label="Имя" id="d_first_name" name="first_name" required />
            </div>
            <Field label="Отчество" id="d_middle_name" name="middle_name" />
            <Field label="Имя артиста / название группы" id="d_artist_name" name="artist_name" placeholder="NOVA, Dark Pulse..." />
            <Field label="Email для связи" id="d_email" name="email" type="email" placeholder="your@email.com" required />
            <Field label="Жанр" id="d_genre" name="genre" placeholder="Techno, Synthwave, House..." />
            <div className="space-y-1.5">
              <Label htmlFor="d_links" className="text-sm text-foreground/80">Ссылки на треки <span className="text-neon-magenta">*</span></Label>
              <Textarea id="d_links" name="links" required placeholder="SoundCloud, Яндекс Диск, Google Drive..." className="bg-background/60 border-border focus:border-neon-cyan transition-colors min-h-[80px]" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d_message" className="text-sm text-foreground/80">Сообщение модератору</Label>
              <Textarea id="d_message" name="message" placeholder="Расскажи о себе, своём звуке и ожиданиях от лейбла..." className="bg-background/60 border-border focus:border-neon-cyan transition-colors min-h-[100px]" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-neon-magenta text-white hover:bg-neon-magenta/90 font-semibold neon-glow-magenta">
              {loading ? 'Отправляем...' : '🎧 Отправить демо'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
