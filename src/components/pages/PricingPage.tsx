import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { PageType } from "@/pages/Index";

interface PricingPageProps {
  onNavigate: (page: PageType) => void;
}

const plans = [
  {
    name: "Безкоштовний",
    price: "0 ₴",
    period: "назавжди",
    description: "Для особистого використання",
    popular: false,
    features: [
      { text: "Необмежена кількість документів", ok: true },
      { text: "Усі базові шаблони", ok: true },
      { text: "Генерація PDF", ok: true },
      { text: "Попередній перегляд документа", ok: true },
      { text: "Завантаження власного PDF", ok: false },
      { text: "Пріоритетна підтримка", ok: false },
      { text: "Збереження документів у хмарі", ok: false },
    ],
    cta: "Почати безкоштовно",
    ctaVariant: "outline" as const,
  },
  {
    name: "Базовий",
    price: "149 ₴",
    period: "на місяць",
    description: "Для активних користувачів",
    popular: true,
    features: [
      { text: "Необмежена кількість документів", ok: true },
      { text: "Усі шаблони, включно з преміум", ok: true },
      { text: "Генерація PDF з брендингом", ok: true },
      { text: "Попередній перегляд документа", ok: true },
      { text: "Завантаження власного PDF", ok: true },
      { text: "Підтримка протягом 24 год", ok: true },
      { text: "Збереження документів у хмарі", ok: false },
    ],
    cta: "Обрати план",
    ctaVariant: "default" as const,
  },
  {
    name: "Бізнес",
    price: "399 ₴",
    period: "на місяць",
    description: "Для підприємств та команд",
    popular: false,
    features: [
      { text: "Необмежена кількість документів", ok: true },
      { text: "Всі шаблони та кастомні форми", ok: true },
      { text: "Генерація PDF з логотипом компанії", ok: true },
      { text: "Попередній перегляд документа", ok: true },
      { text: "Завантаження необмежених PDF", ok: true },
      { text: "Підтримка 24/7", ok: true },
      { text: "Хмарне збереження документів", ok: true },
    ],
    cta: "Зв'язатися з нами",
    ctaVariant: "outline" as const,
  },
];

const features = [
  { icon: "Lock", title: "Безпека даних", desc: "Персональні дані не зберігаються на наших серверах" },
  { icon: "Zap", title: "Миттєва генерація", desc: "PDF готовий за секунди прямо у браузері" },
  { icon: "Globe", title: "Офіційні форми", desc: "Шаблони відповідають українським стандартам" },
  { icon: "RefreshCw", title: "Регулярні оновлення", desc: "Нові шаблони та оновлення щомісяця" },
];

export default function PricingPage({ onNavigate }: PricingPageProps) {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Тарифи</h1>
        <p className="text-muted-foreground">Оберіть зручний план для роботи з документами</p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col border shadow-none relative ${
              plan.popular ? "border-primary shadow-md ring-1 ring-primary" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3">Найпопулярніший</Badge>
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm mb-1">/ {plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm">
                    <Icon
                      name={f.ok ? "Check" : "X"}
                      size={15}
                      className={`mt-0.5 flex-shrink-0 ${f.ok ? "text-green-500" : "text-muted-foreground/40"}`}
                    />
                    <span className={f.ok ? "" : "text-muted-foreground/50"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.ctaVariant}
                className="w-full"
                onClick={() => plan.name === "Бізнес" ? onNavigate("contacts") : onNavigate("editor")}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="bg-muted/30 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-center mb-6">Чому обирають DocUA</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Icon name={f.icon} fallback="Star" size={18} className="text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
