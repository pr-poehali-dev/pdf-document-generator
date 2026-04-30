import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { PageType } from "@/pages/Index";

interface GuidePageProps {
  onNavigate: (page: PageType) => void;
}

const steps = [
  {
    num: 1,
    icon: "LayoutGrid",
    title: "Оберіть шаблон документа",
    desc: "Перейдіть до розділу «Шаблони» та знайдіть потрібний тип документа. Скористайтеся пошуком або фільтрами за категорією. Якщо потрібного шаблону немає — завантажте власний PDF у редакторі.",
    tip: "Найпопулярніші шаблони позначено міткою «Популярний»",
  },
  {
    num: 2,
    icon: "Edit",
    title: "Заповніть поля документа",
    desc: "У редакторі ви побачите всі необхідні поля. Введіть потрібні дані — ПІБ, дату народження, адресу тощо. Праворуч відображається попередній перегляд документа в реальному часі.",
    tip: "Можна додавати власні поля кнопкою «Додати поле»",
  },
  {
    num: 3,
    icon: "Eye",
    title: "Перевірте документ",
    desc: "У правій панелі перегляньте, як виглядатиме документ. Переконайтесь, що всі дані введено правильно, перед збереженням.",
    tip: "Попередній перегляд оновлюється автоматично",
  },
  {
    num: 4,
    icon: "Download",
    title: "Завантажте PDF",
    desc: "Натисніть кнопку «Згенерувати та скачати PDF». Документ автоматично збережеться на ваш пристрій у форматі PDF, готовий до друку або надсилання.",
    tip: "Файл зберігається локально — ваші дані не передаються на сервер",
  },
];

const faq = [
  {
    q: "Чи зберігаються мої дані?",
    a: "Ні. Всі дані обробляються лише у вашому браузері й не передаються нікуди. Ми не зберігаємо жодної особистої інформації.",
  },
  {
    q: "Чи можна завантажити власний PDF-шаблон?",
    a: "Так. У редакторі є вкладка «Свій PDF». Завантажте будь-який PDF, заповніть поля і скачайте документ із підписом.",
  },
  {
    q: "Чи є обмеження на кількість документів?",
    a: "На безкоштовному тарифі можна створювати необмежену кількість документів. Платні тарифи додають додаткові функції.",
  },
  {
    q: "Чи підходять документи для офіційного подання?",
    a: "Шаблони відповідають офіційним форматам. Однак для окремих документів може знадобитись нотаріальне засвідчення.",
  },
  {
    q: "Як додати власне поле?",
    a: "У редакторі натисніть кнопку «Додати поле» — з'явиться нове поле, яке можна заповнити і видалити.",
  },
];

export default function GuidePage({ onNavigate }: GuidePageProps) {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Керівництво користувача</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Дізнайтесь, як швидко і просто створити офіційний документ у кілька кроків
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-12">
        {steps.map((step) => (
          <Card key={step.num} className="border shadow-none">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={step.icon} size={16} className="text-primary" fallback="FileText" />
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.desc}</p>
                  <div className="flex items-start gap-1.5 bg-accent/10 rounded-md px-3 py-2 text-xs text-foreground/70">
                    <Icon name="Lightbulb" size={13} className="mt-0.5 text-accent flex-shrink-0" />
                    {step.tip}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-5">Часті запитання</h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <Card key={item.q} className="border shadow-none">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Icon name="HelpCircle" size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">{item.q}</p>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={() => onNavigate("editor")}>
          <Icon name="Play" size={18} />
          Спробувати зараз
        </Button>
      </div>
    </div>
  );
}
