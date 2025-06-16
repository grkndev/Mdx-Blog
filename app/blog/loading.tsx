import { Loader2 } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <h3 className="text-lg font-medium">Blog yazısı yükleniyor...</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Lütfen bekleyiniz, içerik hazırlanıyor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 