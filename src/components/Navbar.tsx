import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { PageType } from "@/pages/Index";

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navItems: { label: string; page: PageType }[] = [
  { label: "Главная", page: "home" },
  { label: "Редактор", page: "editor" },
  { label: "Шаблоны", page: "templates" },
  { label: "Руководство", page: "guide" },
  { label: "Тарифы", page: "pricing" },
  { label: "Контакты", page: "contacts" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-bold text-lg text-primary"
        >
          <Icon name="FileText" size={22} className="text-accent" />
          DocUA
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onNavigate("editor")}
            className="hidden md:flex"
          >
            <Icon name="Plus" size={16} />
            Создать документ
          </Button>
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border px-4 pb-4">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setMobileOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors mt-1 ${
                currentPage === item.page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
          <Button size="sm" onClick={() => { onNavigate("editor"); setMobileOpen(false); }} className="mt-3 w-full">
            <Icon name="Plus" size={16} />
            Создать документ
          </Button>
        </div>
      )}
    </header>
  );
}
