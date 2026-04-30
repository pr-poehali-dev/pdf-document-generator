import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { PageType } from "@/pages/Index";

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

const features = [
  { icon: "FileText", title: "Готовые шаблоны", desc: "Витяги, довідки, заяви та інші офіційні документи України" },
  { icon: "Upload", title: "Свой шаблон", desc: "Загрузите собственный PDF и заполните нужные поля" },
  { icon: "Download", title: "Скачать PDF", desc: "Готовый документ сохраняется в PDF одним нажатием" },
  { icon: "Shield", title: "Безопасно", desc: "Данные не хранятся на сервере, всё обрабатывается локально" },
  { icon: "Zap", title: "Быстро", desc: "Заполнение документа занимает 2–3 минуты" },
  { icon: "Globe", title: "Украинские документы", desc: "Поддержка украинского языка и официальных форм" },
];

const steps = [
  { num: "1", title: "Выберите шаблон", desc: "Из каталога готовых документов или загрузите свой PDF" },
  { num: "2", title: "Заполните поля", desc: "Введите данные в удобной форме с подсказками" },
  { num: "3", title: "Скачайте PDF", desc: "Готовый документ сохраняется мгновенно" },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground border border-accent/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Icon name="Sparkles" size={14} />
            Сервис заполнения украинских документов
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Заполняйте официальные<br />документы быстро и просто
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Витяги, довідки, заяви — вибирайте шаблон, заповнюйте поля та завантажуйте готовий PDF. Без реєстрації, безкоштовно.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => onNavigate("editor")}>
              <Icon name="Plus" size={18} />
              Создать документ
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate("templates")}>
              <Icon name="LayoutGrid" size={18} />
              Смотреть шаблоны
            </Button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Возможности сервиса</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="border border-border shadow-none hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon name={f.icon} fallback="FileText" size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы начать?</h2>
          <p className="mb-6 opacity-80">Выберите нужный документ и заполните его за несколько минут</p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate("templates")}
            className="bg-white text-primary hover:bg-white/90"
          >
            <Icon name="LayoutGrid" size={18} />
            Выбрать шаблон
          </Button>
        </div>
      </section>
    </div>
  );
}