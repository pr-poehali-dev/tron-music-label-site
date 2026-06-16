import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import func2url from '../../backend/func2url.json';

export type LeadType = 'login' | 'register' | 'demo' | null;

const LEAD_URL = func2url.lead;

const config: Record<Exclude<LeadType, null>, { title: string; desc: string; cta: string }> = {
  login: { title: 'Вход', desc: 'Войди в личный кабинет артиста TRON', cta: 'Войти' },
  register: { title: 'Регистрация', desc: 'Создай аккаунт и начни сотрудничество с лейблом', cta: 'Создать аккаунт' },
  demo: { title: 'Отправить демо', desc: 'Расскажи о себе — A&R команда слушает каждый трек', cta: 'Отправить демо' },
};

interface Props {
  type: LeadType;
  onClose: () => void;
  onSwitch: (t: LeadType) => void;
}

const LeadDialog = ({ type, onClose, onSwitch }: Props) => {
  const [loading, setLoading] = useState(false);
  if (!type) return null;
  const c = config[type];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = { type, ...Object.fromEntries(fd.entries()) };
    try {
      await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      toast({ title: 'Готово!', description: 'Мы получили твою заявку и скоро свяжемся.' });
      onClose();
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуй ещё раз через минуту.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!type} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{c.title}</DialogTitle>
          <DialogDescription>{c.desc}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {(type === 'register' || type === 'demo') && (
            <div className="space-y-1.5">
              <Label htmlFor="name">{type === 'demo' ? 'Имя / псевдоним' : 'Имя'}</Label>
              <Input id="name" name="name" required className="bg-background border-border" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="bg-background border-border" />
          </div>
          {type === 'demo' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="genre">Жанр</Label>
                <Input id="genre" name="genre" placeholder="Techno, Synthwave..." className="bg-background border-border" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="links">Ссылки на треки</Label>
                <Textarea id="links" name="links" required placeholder="SoundCloud, Google Drive..." className="bg-background border-border" />
              </div>
            </>
          )}
          {(type === 'login' || type === 'register') && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" name="password" type="password" required className="bg-background border-border" />
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold neon-glow-cyan">
            {loading ? 'Отправляем...' : c.cta}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          {type === 'login' && (
            <span>Нет аккаунта?{' '}
              <button onClick={() => onSwitch('register')} className="text-neon-cyan hover:underline">Регистрация</button>
            </span>
          )}
          {type === 'register' && (
            <span>Уже с нами?{' '}
              <button onClick={() => onSwitch('login')} className="text-neon-cyan hover:underline">Войти</button>
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDialog;
