import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function v(fields: VytiahFields, key: keyof VytiahFields) {
  return fields[key] || "";
}

/* ---------- Превью документа точно по скриншоту ---------- */
function VytiahPreview({ fields, forPdf }: { fields: VytiahFields; forPdf?: boolean }) {
  const s: React.CSSProperties = {
    fontFamily: "Times New Roman, serif",
    fontSize: forPdf ? "11.5px" : "11px",
    color: "#000",
    background: "#fff",
    width: forPdf ? "794px" : "100%",
    padding: forPdf ? "36px 52px" : "20px 24px",
    boxSizing: "border-box",
    lineHeight: 1.4,
  };

  const line: React.CSSProperties = { borderBottom: "1px solid #000", marginBottom: 0 };
  const lineTop: React.CSSProperties = { borderTop: "1px solid #000" };
  const bold: React.CSSProperties = { fontWeight: 700 };
  const center: React.CSSProperties = { textAlign: "center" };
  const small: React.CSSProperties = { fontSize: "9px", color: "#333" };

  return (
    <div style={s}>
      {/* QR-код вверху справа */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent("https://rtg-cert-dmsu-gov-ua.site/")}`}
          alt="QR"
          width={90}
          height={90}
          crossOrigin="anonymous"
          style={{ display: "block" }}
        />
      </div>

      {/* Заголовок */}
      <div style={{ ...center, marginBottom: "10px" }}>
        <div style={{ ...bold, fontSize: "14px", letterSpacing: "0.5px" }}>ВИТЯГ</div>
        <div style={{ ...bold, fontSize: "14px", letterSpacing: "0.5px" }}>З РЕЄСТРУ ТЕРИТОРІАЛЬНОЇ ГРОМАДИ</div>
      </div>

      {/* Вступний текст */}
      <div style={{ marginBottom: "8px", fontSize: "11px" }}>
        Відомості про особу надані з відомчої інформаційної системи Державної міграційної служби на підставі відомостей, отриманих від
      </div>

      {/* Громада */}
      <div style={{ ...center, ...bold, ...line, paddingBottom: "4px", marginBottom: "2px" }}>
        {v(fields, "gromada")}
      </div>
      <div style={{ ...center, ...small, marginBottom: "8px" }}>назва(и) територіальної(их) громади(и)</div>

      {/* Номер + дата в один рядок */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "0px", ...lineTop, paddingTop: "4px", paddingBottom: "4px", borderBottom: "1px solid #000" }}>
        <div style={{ flex: 1 }}>
          <span>Номер витягу: </span>
          <span style={bold}>{v(fields, "nomervytiah")}</span>
        </div>
        <div style={{ flex: 2 }}>
          <span>Дата та час формування: </span>
          <span style={bold}>{v(fields, "date")}</span>
        </div>
      </div>

      {/* Таблиця полів особи */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
        <tbody>
          {(
            [
              ["Прізвище", v(fields, "prizvyshche")],
              ["Власне ім'я", v(fields, "imya")],
              ["По батькові (за наявності)", v(fields, "pobatkovi")],
              ["Дата народження", v(fields, "dnarod")],
              ["УНЗР (за наявності)", v(fields, "unzr")],
              ["РНОКПП (за наявності)", v(fields, "rnokpp")],
            ] as [string, string][]
          ).map(([label, val]) => (
            <tr key={label}>
              <td style={{ padding: "3px 4px 3px 4px", width: "42%", color: "#333", fontWeight: 400 }}>{label}</td>
              <td style={{ padding: "3px 0 3px 8px", fontWeight: 700, color: "#000" }}>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Таблиця адреси */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", marginBottom: "12px", fontSize: "10px" }}>
        <thead>
          <tr>
            <td colSpan={2} style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center", verticalAlign: "middle", width: "28%" }}>
              Дата проведення реєстраційної дії
            </td>
            <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }} rowSpan={2}>
              Адреса місця проживання
            </td>
            <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }} rowSpan={2}>
              Країна вибуття на постійне проживання
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }}>
              Дата декларування /реєстрації
            </td>
            <td style={{ border: "1px solid #000", padding: "4px 6px", textAlign: "center" }}>
              Дата зняття (скасування)
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}>{v(fields, "datareg")}</td>
            <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}></td>
            <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}>{v(fields, "adresa")}</td>
            <td style={{ border: "1px solid #000", padding: "5px 6px", verticalAlign: "top" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Підстава */}
      <div style={{ marginBottom: "4px" }}>Витяг сформовано на підставі</div>
      <div style={{ ...center, ...bold, ...line, paddingBottom: "3px", marginBottom: "2px" }}>
        заява особи {v(fields, "zayavnyk")}
      </div>
      <div style={{ ...center, ...small, marginBottom: "6px" }}>
        (зазначається заява: особи / законного представника / представника / власника (співвласника) житла, уповноваженої особи житла, іпотекодержателя або довірчого власника, прізвище та ініціали особи або дані юридичної особи)
      </div>
      <div style={{ marginBottom: "4px" }}>від {v(fields, "datazapyt")}</div>
      <div style={{ marginBottom: "4px" }}>отриманої за запитом</div>

      {/* ДП ДІЯ */}
      <div style={{ ...center, ...bold, ...line, paddingBottom: "3px", marginBottom: "2px" }}>
        Державне підприємство "ДІЯ"
      </div>
      <div style={{ ...center, ...small, marginBottom: "8px" }}>(відомості про суб'єкта запиту)</div>

      {/* Підпис */}
      <div style={{ ...small, marginTop: "6px" }}>Витяг підписано КЕП ДМС</div>
    </div>
  );
}

export default function EditorPage({ selectedTemplate }: EditorPageProps) {
  const templateId = selectedTemplate || "vytiah-registry";

  const [fields, setFields] = useState<VytiahFields>({ ...EMPTY });
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const update = (key: keyof VytiahFields, val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedPdf(file);
      toast({ title: "PDF завантажено", description: file.name });
    } else {
      toast({ title: "Помилка", description: "Виберіть файл PDF", variant: "destructive" });
    }
  };

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
        // розбиваємо на сторінки через clip
        let offsetY = 0;
        while (offsetY < imgH) {
          if (offsetY > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, margin - offsetY, imgW, imgH);
          // белый прямоугольник снизу, чтобы закрыть остаток
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
    <div className="container max-w-6xl mx-auto px-4 py-8">
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

      <Tabs defaultValue={templateId === "vytiah-registry" ? "template" : "upload"}>
        <TabsList className="mb-4">
          <TabsTrigger value="template">
            <Icon name="FileText" size={15} />
            Шаблон
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Icon name="Upload" size={15} />
            Свій PDF
          </TabsTrigger>
        </TabsList>

        {/* Шаблон витягу */}
        <TabsContent value="template">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Форма */}
            <div className="lg:col-span-2 space-y-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Дані документа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
            </div>

            {/* Превью */}
            <div className="lg:col-span-3">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Попередній перегляд</p>
                  <Button size="sm" onClick={generatePdf} disabled={generating}>
                    <Icon name="FileDown" size={15} />
                    {generating ? "Генерація..." : "Скачати PDF"}
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
                  <div ref={previewRef} className="origin-top-left" style={{ minWidth: "560px" }}>
                    <VytiahPreview fields={fields} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Свій PDF */}
        <TabsContent value="upload">
          <Card>
            <CardContent className="p-8">
              <div
                className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="Upload" size={40} className="mx-auto mb-4 text-muted-foreground" />
                <p className="font-medium mb-1">
                  {uploadedPdf ? uploadedPdf.name : "Натисніть або перетягніть PDF файл"}
                </p>
                <p className="text-sm text-muted-foreground">Підтримується формат PDF до 10 МБ</p>
                {uploadedPdf && (
                  <div className="mt-3 inline-flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-1.5 rounded-full">
                    <Icon name="CheckCircle" size={15} />
                    Файл завантажено
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
              {uploadedPdf && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Редагування завантажених PDF буде доступне в наступній версії.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}