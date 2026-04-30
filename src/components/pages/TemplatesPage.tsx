import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { PageType } from "@/pages/Index";

interface TemplatesPageProps {
  onNavigate: (page: PageType, template?: string) => void;
}

const templates = [
  {
    id: "vytiah-registry",
    title: "Витяг з реєстру територіальної громади",
    desc: "Відомості про особу з Державної міграційної служби. Містить ПІБ, дату народження, УНЗР, РНОКПП, адресу проживання.",
    category: "Реєстр",
    fields: 8,
    popular: true,
  },
  {
    id: "dovidka-prozhyvannya",
    title: "Довідка про місце проживання",
    desc: "Підтвердження адреси реєстрації особи для різних установ та організацій.",
    category: "Довідки",
    fields: 6,
    popular: true,
  },
  {
    id: "zayava-zagublennya",
    title: "Заява про загублення документа",
    desc: "Офіційна заява до органів про факт втрати паспорта або іншого документа.",
    category: "Заяви",
    fields: 7,
    popular: false,
  },
  {
    id: "dovidka-work",
    title: "Довідка з місця роботи",
    desc: "Підтвердження трудових відносин і доходу для банків, посольств, судів.",
    category: "Довідки",
    fields: 9,
    popular: true,
  },
  {
    id: "zayava-diya",
    title: "Заява до Дії",
    desc: "Стандартна заява на отримання державних послуг через портал Дія.",
    category: "Заяви",
    fields: 5,
    popular: false,
  },
  {
    id: "dogovir-kupivli",
    title: "Договір купівлі-продажу",
    desc: "Типовий договір між фізичними особами для оформлення угоди купівлі-продажу майна.",
    category: "Договори",
    fields: 12,
    popular: false,
  },
  {
    id: "dovirenist",
    title: "Довіреність",
    desc: "Документ, що надає право діяти від імені довірителя у визначених питаннях.",
    category: "Договори",
    fields: 8,
    popular: false,
  },
  {
    id: "zayava-reestraciya",
    title: "Заява на реєстрацію ФОП",
    desc: "Заява фізичної особи-підприємця для реєстрації в державних органах.",
    category: "Заяви",
    fields: 10,
    popular: false,
  },
];

const categories = ["Усі", "Реєстр", "Довідки", "Заяви", "Договори"];

export default function TemplatesPage({ onNavigate }: TemplatesPageProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Усі");

  const filtered = templates.filter((t) => {
    const matchCat = category === "Усі" || t.category === category;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Каталог шаблонів</h1>
        <p className="text-muted-foreground">Вибирайте готовий шаблон і заповнюйте документ онлайн</p>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Пошук шаблону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-foreground border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="flex flex-col border shadow-none hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                  {t.popular && (
                    <Badge className="text-xs bg-accent text-accent-foreground">Популярний</Badge>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-2 leading-snug">{t.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="ListChecks" size={13} />
                {t.fields} полів для заповнення
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                size="sm"
                onClick={() => onNavigate("editor", t.id)}
              >
                <Icon name="Edit" size={15} />
                Заповнити
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Шаблони не знайдено. Спробуйте інший запит.</p>
        </div>
      )}
    </div>
  );
}
