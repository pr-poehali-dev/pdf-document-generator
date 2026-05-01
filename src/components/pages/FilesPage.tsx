import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const FILES_URL = "https://functions.poehali.dev/6ac0a264-1e65-4989-8c67-221fb442c947";

interface FileItem {
  id: number;
  name: string;
  created_at: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<number | null>(null);

  useEffect(() => {
    fetch(FILES_URL)
      .then((r) => r.text())
      .then((text) => {
        const data = JSON.parse(text);
        const inner = typeof data === "string" ? JSON.parse(data) : data;
        setFiles((inner.files as FileItem[]) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const openFile = async (id: number, name: string) => {
    setOpening(id);
    try {
      const res = await fetch(`${FILES_URL}?id=${id}`);
      const text = await res.text();
      const data = JSON.parse(text);
      const inner = typeof data === "string" ? JSON.parse(data) : data;
      const b64 = inner.pdf;
      const byteArr = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const blob = new Blob([byteArr], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      console.error(e);
    } finally {
      setOpening(null);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Збережені документи</h1>
        <p className="text-sm text-muted-foreground mt-1">Усі згенеровані PDF-файли</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Icon name="Loader2" size={24} className="animate-spin mr-2" />
          Завантаження...
        </div>
      )}

      {!loading && files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Icon name="FolderOpen" size={48} />
          <p className="text-lg">Файлів поки немає</p>
          <p className="text-sm">Згенеруйте документ у редакторі — він з'явиться тут</p>
        </div>
      )}

      {!loading && files.length > 0 && (
        <div className="flex flex-col gap-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between border rounded-lg px-4 py-3 bg-white shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <Icon name="FileText" size={22} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(file.created_at)}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 ml-3"
                disabled={opening === file.id}
                onClick={() => openFile(file.id, file.name)}
              >
                {opening === file.id
                  ? <Icon name="Loader2" size={15} className="animate-spin" />
                  : <Icon name="Download" size={15} />}
                Відкрити
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}