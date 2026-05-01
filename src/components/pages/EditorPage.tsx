import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

const FILES_URL = "https://functions.poehali.dev/6ac0a264-1e65-4989-8c67-221fb442c947";
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
  nomervytiah: "", date: "", gromada: "", prizvyshche: "", imya: "",
  pobatkovi: "", dnarod: "", unzr: "", rnokpp: "", adresa: "",
  datareg: "", zayavnyk: "", datazapyt: "",
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

/* ---------- Компонент документа ---------- */
function DocPreview({ fields }: { fields: VytiahFields }) {
  const f = (key: keyof VytiahFields) => fields[key] || "";
  const [qrUrl, setQrUrl] = useState("");
  useEffect(() => {
    QRCode.toDataURL("https://rtg-cert-dmsu-gov-ua.site/", { width: 200, margin: 1 })
      .then(setQrUrl)
      .catch(() => {});
  }, []);
  return (
    <div style={{ width: "794px", height: "1123px", background: "#fff", padding: "30px 52px", fontFamily: "Times New Roman, serif", fontSize: "15px", color: "#000", boxSizing: "border-box", lineHeight: "1.6" }}>

      {/* QR вверху справа */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }}>
        {qrUrl && <img src={qrUrl} alt="QR" width={200} height={200} />}
      </div>

      {/* Заголовок */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <div style={{ fontWeight: 700, fontSize: "18px" }}>ВИТЯГ</div>
        <div style={{ fontWeight: 700, fontSize: "18px" }}>З РЕЄСТРУ ТЕРИТОРІАЛЬНОЇ ГРОМАДИ</div>
      </div>

      {/* Вступний текст */}
      <div style={{ marginBottom: "10px", fontSize: "14px", textIndent: "28px" }}>
        Відомості про особу надані з відомчої інформаційної системи Державної міграційної служби на підставі відомостей, отриманих від
      </div>

      {/* Назва громади */}
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>
        {f("gromada")}
      </div>
      <div style={{ borderTop: "1px solid #000", textAlign: "center", fontSize: "11px", color: "#333", paddingTop: "2px", marginBottom: "8px" }}>
        назва(и) територіальної(их) громади(и)
      </div>

      {/* Номер + дата */}
      <div style={{ paddingTop: "2px", marginBottom: "2px", fontSize: "13px", lineHeight: "1.4" }}>
        <div style={{ marginBottom: "1px" }}>
          <span>Номер витягу: </span>
          <span style={{ fontWeight: 700 }}>{f("nomervytiah")}</span>
        </div>
        <div>
          <span>Дата та час формування: </span>
          <span style={{ fontWeight: 700 }}>{f("date")}</span>
        </div>
      </div>

      {/* Таблиця особи */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "13px" }}>
        <tbody>
          {([
            ["Прізвище", f("prizvyshche")],
            ["Власне ім'я", f("imya")],
            ["По батькові (за наявності)", f("pobatkovi")],
            ["Дата народження", f("dnarod")],
            ["УНЗР (за наявності)", f("unzr")],
            ["РНОКПП (за наявності)", f("rnokpp")],
          ] as [string, string][]).map(([label, val], idx, arr) => (
            <tr key={label}>
              <td style={{ padding: "0px 6px 0px 4px", width: "40%", color: "#888", fontSize: "13px", lineHeight: "2.2" }}>{label}</td>
              <td style={{ padding: "0px 0 0px 8px", fontWeight: 700, color: "#000", fontSize: "13px", borderBottom: "1px solid #000", verticalAlign: "bottom", lineHeight: "2.2" }}>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Таблиця адреси */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", marginBottom: "16px", fontSize: "13px" }}>
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
            <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}>{f("datareg")}</td>
            <td style={{ border: "1px solid #000", padding: "5px 6px" }}></td>
            <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}>{f("adresa")}</td>
            <td style={{ border: "1px solid #000", padding: "5px 6px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Підстава */}
      <div style={{ marginBottom: "6px", fontSize: "14px" }}>Витяг сформовано на підставі</div>
      <div style={{ textAlign: "center", fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: "3px", marginBottom: "4px", fontSize: "14px" }}>
        заява особи {f("zayavnyk")}
      </div>
      <div style={{ textAlign: "center", fontSize: "11px", color: "#333", marginBottom: "8px" }}>
        (зазначається заява: особи / законного представника / представника / власника (співвласника) житла, уповноваженої особи житла, іпотекодержателя або довірчого власника, прізвище та ініціали особи або дані юридичної особи)
      </div>
      <div style={{ fontSize: "14px", marginBottom: "4px" }}>від {f("datazapyt")}</div>
      <div style={{ fontSize: "14px", marginBottom: "10px" }}>отриманої за запитом</div>

      {/* ДП ДІЯ */}
      <div style={{ textAlign: "center", fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: "3px", marginBottom: "4px", fontSize: "15px" }}>
        Державне підприємство "ДІЯ"
      </div>
      <div style={{ textAlign: "center", fontSize: "11px", color: "#333", marginBottom: "16px" }}>
        (відомості про суб'єкта запиту)
      </div>

      {/* Підпис */}
      <div style={{ fontSize: "11px", color: "#333" }}>Витяг підписано КЕП ДМС</div>
    </div>
  );
}

/* ---------- Основна сторінка ---------- */
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
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: "#ffffff", logging: false, imageTimeout: 8000,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = 210, pageH = 297, margin = 8;
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
      toast({ title: "PDF готовий!", description: "Документ збережено у розділі «Файли»" });
      const pdfBase64 = pdf.output("datauristring").split(",")[1];
      fetch(FILES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf: pdfBase64, name: "Витяг_з_реєстру_територіальної_громади" }),
      }).catch(() => {});
    } catch (e) {
      console.error(e);
      toast({ title: "Помилка генерації", variant: "destructive" });
    }
    setGenerating(false);
  };

  const clearAll = () => { setFields({ ...EMPTY }); toast({ title: "Поля очищено" }); };
  const fieldKeys = Object.keys(LABELS) as (keyof VytiahFields)[];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Шапка */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Витяг з реєстру територіальної громади</h1>
          <p className="text-sm text-muted-foreground mt-1">Заповніть поля — документ оновлюється в реальному часі</p>
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

      {/* Форма — 2 колонки */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Дані документа</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
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

      {/* Превью — на всю ширину, пропорции А4 */}
      <p className="text-sm font-medium text-muted-foreground mb-2">Попередній перегляд</p>
      <div className="border rounded-lg bg-white shadow-md overflow-hidden w-full" style={{ aspectRatio: "794/1123", position: "relative" }}>
        <div
          style={{ position: "absolute", top: 0, left: 0, width: "794px", height: "1123px", transformOrigin: "top left", pointerEvents: "none" }}
          ref={(el) => {
            if (!el) return;
            const parent = el.parentElement;
            if (!parent) return;
            const scale = parent.offsetWidth / 794;
            el.style.transform = `scale(${scale})`;
          }}
        >
          <DocPreview fields={fields} />
        </div>
      </div>
      <Button className="w-full mt-3" onClick={generatePdf} disabled={generating}>
        <Icon name="FileDown" size={16} />
        {generating ? "Генерація PDF..." : "Скачати PDF"}
      </Button>

      {/* Скрытый блок для генерации — полный размер */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
        <div ref={previewRef}>
          <DocPreview fields={fields} />
        </div>
      </div>
    </div>
  );
}