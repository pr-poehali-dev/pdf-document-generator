import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface EditorPageProps {
  selectedTemplate: string | null;
}

interface VytiahFields {
  nomervytiah: string;
  date: string;
  gromada: string;
  prizvyshche: string;
  imya: string;
  pobatkovi: string;
  dnarod: string;
  unzr: string;
  rnokpp: string;
  adresa: string;
  datareg: string;
  zayavnyk: string;
  datazapyt: string;
}

const EMPTY: VytiahFields = {
  nomervytiah: "",
  date: "",
  gromada: "",
  prizvyshche: "",
  imya: "",
  pobatkovi: "",
  dnarod: "",
  unzr: "",
  rnokpp: "",
  adresa: "",
  datareg: "",
  zayavnyk: "",
  datazapyt: "",
};

const PLACEHOLDERS: VytiahFields = {
  nomervytiah: "2023/007497299",
  date: "18.09.2023 18 год. 56 хв.",
  gromada: "Харківська територіальна громада",
  prizvyshche: "Чалий",
  imya: "Сергій",
  pobatkovi: "Сергійович",
  dnarod: "14.01.2007",
  unzr: "20070114-07150",
  rnokpp: "3909502612",
  adresa: "Харківська область, Харківський район, м. Харків, Основ'янський район, вул. Сидоренківська, буд. 48, кв. 5",
  datareg: "30.01.2007",
  zayavnyk: "Чалий С. С.",
  datazapyt: "18.09.2023",
};

const LABELS: Record<keyof VytiahFields, string> = {
  nomervytiah: "Номер витягу",
  date: "Дата та час формування",
  gromada: "Назва громади",
  prizvyshche: "Прізвище",
  imya: "Власне ім'я",
  pobatkovi: "По батькові (за наявності)",
  dnarod: "Дата народження",
  unzr: "УНЗР (за наявності)",
  rnokpp: "РНОКПП (за наявності)",
  adresa: "Адреса місця проживання",
  datareg: "Дата декларування / реєстрації",
  zayavnyk: "Заявник (ПІБ)",
  datazapyt: "Дата запиту",
};

export default function EditorPage({ selectedTemplate: _selectedTemplate }: EditorPageProps) {
  const [fields, setFields] = useState<VytiahFields>({ ...EMPTY });
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const update = (key: keyof VytiahFields, val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const generatePdf = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 8000,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageW = 210;
      const pageH = 297;
      const margin = 8;
      const imgW = pageW - margin * 2;
      const imgH = (canvas.height * imgW) / canvas.width;
      const availH = pageH - margin * 2;

      if (imgH <= availH) {
        pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
      } else {
        let offsetY = 0;
        while (offsetY < imgH) {
          if (offsetY > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, margin - offsetY, imgW, imgH);
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, margin + availH, pageW, pageH, "F");
          offsetY += availH;
        }
      }

      pdf.save("Витяг_з_реєстру_територіальної_громади.pdf");
      toast({ title: "PDF готовий!", description: "Документ збережено" });
    } catch (e) {
      console.error(e);
      toast({ title: "Помилка генерації", variant: "destructive" });
    }
    setGenerating(false);
  };

  const clearAll = () => {
    setFields({ ...EMPTY });
    toast({ title: "Поля очищено" });
  };

  const fieldKeys = Object.keys(LABELS) as (keyof VytiahFields)[];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Витяг з реєстру територіальної громади</h1>
          <p className="text-sm text-muted-foreground mt-1">Заповніть поля та завантажте готовий PDF</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Icon name="RotateCcw" size={15} />
            Очистити
          </Button>
          <Button size="sm" onClick={generatePdf} disabled={generating}>
            <Icon name="Download" size={15} />
            {generating ? "Генерація..." : "Скачати PDF"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Дані документа</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {fieldKeys.map((key) => (
            <div key={key}>
              <Label className="text-xs mb-1 block text-muted-foreground">{LABELS[key]}</Label>
              <Input
                placeholder={PLACEHOLDERS[key]}
                value={fields[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Прихований блок для генерації PDF */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
        <div ref={previewRef} style={{ width: "794px", background: "#fff", padding: "48px 56px", fontFamily: "Times New Roman, serif", fontSize: "12px", color: "#000", boxSizing: "border-box" }}>
          <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>Макет PDF буде тут</p>
        </div>
      </div>
    </div>
  );
}
