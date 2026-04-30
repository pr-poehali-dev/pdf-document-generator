import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";

interface EditorPageProps {
  selectedTemplate: string | null;
}

interface Field {
  id: string;
  label: string;
  placeholder: string;
  value: string;
}

const TEMPLATE_FIELDS: Record<string, Field[]> = {
  "vytiah-registry": [
    { id: "nomervytiah", label: "Номер витягу", placeholder: "2023/007497299", value: "" },
    { id: "date", label: "Дата та час формування", placeholder: "18.09.2023 18 год. 56 хв.", value: "" },
    { id: "gromada", label: "Назва громади", placeholder: "Харківська територіальна громада", value: "" },
    { id: "prizvyshche", label: "Прізвище", placeholder: "Чалий", value: "" },
    { id: "imya", label: "Власне ім'я", placeholder: "Сергій", value: "" },
    { id: "pobatkovi", label: "По батькові", placeholder: "Сергійович", value: "" },
    { id: "dnarod", label: "Дата народження", placeholder: "14.01.2007", value: "" },
    { id: "unzr", label: "УНЗР", placeholder: "20070114-07150", value: "" },
    { id: "rnokpp", label: "РНОКПП", placeholder: "3909502612", value: "" },
    { id: "adresa", label: "Адреса місця проживання", placeholder: "м. Харків, вул. Сидоренківська, буд. 48, кв. 5", value: "" },
    { id: "datareg", label: "Дата декларування/реєстрації", placeholder: "30.01.2007", value: "" },
  ],
  "dovidka-prozhyvannya": [
    { id: "prizvyshche", label: "Прізвище", placeholder: "Іваненко", value: "" },
    { id: "imya", label: "Ім'я", placeholder: "Іван", value: "" },
    { id: "pobatkovi", label: "По батькові", placeholder: "Іванович", value: "" },
    { id: "dnarod", label: "Дата народження", placeholder: "01.01.1990", value: "" },
    { id: "adresa", label: "Адреса реєстрації", placeholder: "м. Київ, вул. Хрещатик, 1, кв. 1", value: "" },
    { id: "vydana", label: "Довідка видана для", placeholder: "банку / суду / посольства", value: "" },
  ],
  "default": [
    { id: "prizvyshche", label: "Прізвище", placeholder: "Іваненко", value: "" },
    { id: "imya", label: "Ім'я", placeholder: "Іван", value: "" },
    { id: "pobatkovi", label: "По батькові", placeholder: "Іванович", value: "" },
    { id: "dnarod", label: "Дата народження", placeholder: "01.01.1990", value: "" },
    { id: "adresa", label: "Адреса", placeholder: "м. Київ, вул. Хрещатик, 1", value: "" },
  ],
};

const TEMPLATE_TITLES: Record<string, string> = {
  "vytiah-registry": "Витяг з реєстру територіальної громади",
  "dovidka-prozhyvannya": "Довідка про місце проживання",
  "zayava-zagublennya": "Заява про загублення документа",
  "dovidka-work": "Довідка з місця роботи",
  "zayava-diya": "Заява до Дії",
  "dogovir-kupivli": "Договір купівлі-продажу",
  "dovirenist": "Довіреність",
  "zayava-reestraciya": "Заява на реєстрацію ФОП",
};

export default function EditorPage({ selectedTemplate }: EditorPageProps) {
  const templateId = selectedTemplate || "vytiah-registry";
  const templateTitle = TEMPLATE_TITLES[templateId] || "Новий документ";
  const initialFields = (TEMPLATE_FIELDS[templateId] || TEMPLATE_FIELDS["default"]).map((f) => ({ ...f }));

  const [fields, setFields] = useState<Field[]>(initialFields);
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const updateField = (id: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const addCustomField = () => {
    const id = `custom_${Date.now()}`;
    setFields((prev) => [...prev, { id, label: "Нове поле", placeholder: "Введіть значення", value: "" }]);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedPdf(file);
      toast({ title: "PDF загружен", description: file.name });
    } else {
      toast({ title: "Ошибка", description: "Выберите файл в формате PDF", variant: "destructive" });
    }
  };

  const generatePdf = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageW = 210;
      const pageH = 297;
      const margin = 10;
      const imgW = pageW - margin * 2;
      const imgH = (canvas.height * imgW) / canvas.width;
      const availH = pageH - margin * 2;

      if (imgH <= availH) {
        pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
      } else {
        let renderedH = 0;
        while (renderedH < imgH) {
          const sliceH = Math.min(availH, imgH - renderedH);
          if (renderedH > 0) pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, margin - renderedH, imgW, imgH);
          renderedH += sliceH;
          // clip
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, margin + sliceH, pageW, pageH, "F");
        }
      }

      const filename = (customTitle || templateTitle).substring(0, 40).replace(/\s+/g, "_") + ".pdf";
      pdf.save(filename);
      toast({ title: "PDF готовий!", description: "Документ збережено" });
    } catch {
      toast({ title: "Помилка генерації", variant: "destructive" });
    }
    setGenerating(false);
  };

  const clearAll = () => {
    setFields(initialFields.map((f) => ({ ...f, value: "" })));
    toast({ title: "Поля очищено" });
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{templateTitle}</h1>
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

      <Tabs defaultValue="template">
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

        {/* Template mode */}
        <TabsContent value="template">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Form */}
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Дані документа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs mb-1 block">Назва документа (необов'язково)</Label>
                    <Input
                      placeholder={templateTitle}
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                    />
                  </div>
                  {fields.map((field) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Label className="text-xs mb-1 block text-muted-foreground">{field.label}</Label>
                        <Input
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={(e) => updateField(field.id, e.target.value)}
                        />
                      </div>
                      {field.id.startsWith("custom_") && (
                        <button
                          onClick={() => removeField(field.id)}
                          className="mt-6 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addCustomField} className="w-full">
                    <Icon name="Plus" size={15} />
                    Додати поле
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Попередній перегляд</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    ref={previewRef}
                    className="bg-white border rounded-md p-6 min-h-64 shadow-inner"
                    style={{ fontFamily: "'Golos Text', sans-serif", fontSize: "13px", color: "#111" }}
                  >
                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: "14px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "2px solid #1e3c78" }}>
                      {(customTitle || templateTitle).toUpperCase()}
                    </div>
                    {fields.map((f) => (
                      <div key={f.id} style={{ marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px dashed #ddd" }}>
                        <div style={{ fontSize: "11px", color: "#666", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</div>
                        <div style={{ fontWeight: 500, color: f.value ? "#111" : "#bbb", fontStyle: f.value ? "normal" : "italic" }}>
                          {f.value || "не заповнено"}
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: "16px", fontSize: "11px", color: "#aaa", textAlign: "right" }}>
                      Сформовано: {new Date().toLocaleDateString("uk-UA")}
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={generatePdf} disabled={generating}>
                    <Icon name="FileDown" size={16} />
                    {generating ? "Генерація PDF..." : "Згенерувати та скачати PDF"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Upload mode */}
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
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />

              {uploadedPdf && (
                <div className="mt-6 space-y-4">
                  <p className="font-medium text-sm">Заповніть поля для вашого документа:</p>
                  {fields.map((field) => (
                    <div key={field.id}>
                      <Label className="text-xs mb-1 block text-muted-foreground">{field.label}</Label>
                      <Input
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => updateField(field.id, e.target.value)}
                      />
                    </div>
                  ))}
                  <Button onClick={addCustomField} variant="outline" size="sm">
                    <Icon name="Plus" size={15} />
                    Додати поле
                  </Button>
                  <Button className="w-full mt-2" onClick={generatePdf} disabled={generating}>
                    <Icon name="FileDown" size={16} />
                    {generating ? "Генерація..." : "Скачати заповнений PDF"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}