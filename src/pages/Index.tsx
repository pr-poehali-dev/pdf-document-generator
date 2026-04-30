import { useState } from "react";
import Navbar from "@/components/Navbar";
import HomePage from "@/components/pages/HomePage";
import EditorPage from "@/components/pages/EditorPage";
import TemplatesPage from "@/components/pages/TemplatesPage";
import GuidePage from "@/components/pages/GuidePage";
import PricingPage from "@/components/pages/PricingPage";
import ContactsPage from "@/components/pages/ContactsPage";

export type PageType = "home" | "editor" | "templates" | "guide" | "pricing" | "contacts";

export default function Index() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const navigate = (page: PageType, template?: string) => {
    setCurrentPage(page);
    if (template) setSelectedTemplate(template);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-golos">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="pt-16">
        {currentPage === "home" && <HomePage onNavigate={navigate} />}
        {currentPage === "editor" && <EditorPage selectedTemplate={selectedTemplate} />}
        {currentPage === "templates" && <TemplatesPage onNavigate={navigate} />}
        {currentPage === "guide" && <GuidePage onNavigate={navigate} />}
        {currentPage === "pricing" && <PricingPage onNavigate={navigate} />}
        {currentPage === "contacts" && <ContactsPage />}
      </main>
    </div>
  );
}
