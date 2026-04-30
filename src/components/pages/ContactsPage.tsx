import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";

const contacts = [
  { icon: "Mail", label: "Email підтримки", value: "support@docua.com.ua", href: "mailto:support@docua.com.ua" },
  { icon: "MessageCircle", label: "Telegram", value: "@docua_support", href: "https://t.me/docua_support" },
  { icon: "Clock", label: "Час роботи", value: "Пн–Пт, 9:00–18:00", href: null },
  { icon: "MapPin", label: "Розташування", value: "Україна", href: null },
];

export default function ContactsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({ title: "Заповніть всі поля", variant: "destructive" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setName("");
      setEmail("");
      setMessage("");
      toast({ title: "Повідомлення надіслано!", description: "Ми відповімо протягом 24 годин" });
    }, 1000);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Зв'язатися з нами</h1>
        <p className="text-muted-foreground">Маєте питання? Напишіть нам — відповімо найближчим часом</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="border shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Надіслати повідомлення</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Ваше ім'я</Label>
                <Input
                  placeholder="Іван Іваненко"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder="ivan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Повідомлення</Label>
                <Textarea
                  placeholder="Опишіть ваше питання або проблему..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                <Icon name="Send" size={16} />
                {sending ? "Надсилання..." : "Надіслати"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contacts */}
        <div className="space-y-4">
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Контактна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon} fallback="Info" size={17} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-medium text-primary hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border shadow-none bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Не знайшли відповідь?</p>
                  <p className="text-sm text-muted-foreground">
                    Перегляньте наше{" "}
                    <span className="font-medium text-primary cursor-pointer hover:underline">Керівництво</span>{" "}
                    — можливо, відповідь вже є там.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
