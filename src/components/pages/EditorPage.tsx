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

      {/* Скрытый блок для генерации PDF */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
        <div ref={previewRef} style={{ width: "794px", background: "#fff", padding: "40px 60px 40px 60px", fontFamily: "Times New Roman, serif", fontSize: "12px", color: "#000", boxSizing: "border-box", lineHeight: "1.45" }}>

          {/* QR вверху справа */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Frtg-cert-dmsu-gov-ua.site%2F"
              alt="QR" width={100} height={100} crossOrigin="anonymous"
            />
          </div>

          {/* Заголовок */}
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>ВИТЯГ</div>
            <div style={{ fontWeight: 700, fontSize: "14px" }}>З РЕЄСТРУ ТЕРИТОРІАЛЬНОЇ ГРОМАДИ</div>
          </div>

          {/* Вступний текст */}
          <div style={{ marginBottom: "8px", fontSize: "11.5px", textIndent: "24px" }}>
            Відомості про особу надані з відомчої інформаційної системи Державної міграційної служби на підставі відомостей, отриманих від
          </div>

          {/* Назва громади */}
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: "12px", marginBottom: "1px" }}>
            {fields.gromada || ""}
          </div>
          <div style={{ borderTop: "1px solid #000", textAlign: "center", fontSize: "9px", color: "#333", paddingTop: "1px", marginBottom: "6px" }}>
            назва(и) територіальної(их) громади(и)
          </div>

          {/* Номер витягу + дата */}
          <div style={{ display: "flex", borderTop: "1px solid #000", paddingTop: "3px", marginBottom: "0px" }}>
            <div style={{ flex: "0 0 45%" }}>
              <span style={{ fontSize: "11.5px" }}>Номер витягу: </span>
              <span style={{ fontWeight: 700 }}>{fields.nomervytiah || ""}</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11.5px" }}>Дата та час формування: </span>
              <span style={{ fontWeight: 700 }}>{fields.date || ""}</span>
            </div>
          </div>

          {/* Таблиця особи — без ліній між рядками */}
          <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "1px solid #000", borderBottom: "1px solid #000", marginBottom: "10px", fontSize: "11.5px" }}>
            <tbody>
              {([
                ["Прізвище", fields.prizvyshche],
                ["Власне ім'я", fields.imya],
                ["По батькові (за наявності)", fields.pobatkovi],
                ["Дата народження", fields.dnarod],
                ["УНЗР (за наявності)", fields.unzr],
                ["РНОКПП (за наявності)", fields.rnokpp],
              ] as [string, string][]).map(([label, val]) => (
                <tr key={label}>
                  <td style={{ padding: "2px 6px 2px 4px", width: "43%", color: "#222" }}>{label}</td>
                  <td style={{ padding: "2px 0 2px 8px", fontWeight: 700 }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Таблиця адреси */}
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", marginBottom: "14px", fontSize: "10.5px" }}>
            <thead>
              <tr>
                <td colSpan={2} style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center", width: "26%" }}>
                  Дата проведення реєстраційної дії
                </td>
                <td rowSpan={2} style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center", width: "40%" }}>
                  Адреса місця проживання
                </td>
                <td rowSpan={2} style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }}>
                  Країна вибуття на постійне проживання
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }}>Дата декларування /реєстрації</td>
                <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }}>Дата зняття (скасування)</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}>{fields.datareg || ""}</td>
                <td style={{ border: "1px solid #000", padding: "5px 6px" }}></td>
                <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}>{fields.adresa || ""}</td>
                <td style={{ border: "1px solid #000", padding: "5px 6px" }}></td>
              </tr>
            </tbody>
          </table>

          {/* Підстава */}
          <div style={{ marginBottom: "4px", fontSize: "11.5px" }}>Витяг сформовано на підставі</div>
          <div style={{ textAlign: "center", fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "3px", fontSize: "11.5px" }}>
            заява особи {fields.zayavnyk || ""}
          </div>
          <div style={{ textAlign: "center", fontSize: "9px", color: "#333", marginBottom: "6px" }}>
            (зазначається заява: особи / законного представника / представника / власника (співвласника) житла, уповноваженої особи житла, іпотекодержателя або довірчого власника, прізвище та ініціали особи або дані юридичної особи)
          </div>
          <div style={{ fontSize: "11.5px", marginBottom: "3px" }}>від {fields.datazapyt || ""}</div>
          <div style={{ fontSize: "11.5px", marginBottom: "6px" }}>отриманої за запитом</div>

          {/* ДП ДІЯ */}
          <div style={{ textAlign: "center", fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "3px", fontSize: "12px" }}>
            Державне підприємство "ДІЯ"
          </div>
          <div style={{ textAlign: "center", fontSize: "9px", color: "#333", marginBottom: "12px" }}>
            (відомості про суб'єкта запиту)
          </div>

          {/* Підпис */}
          <div style={{ fontSize: "9px", color: "#333" }}>Витяг підписано КЕП ДМС</div>
        </div>
      </div>
    </div>
  );
}