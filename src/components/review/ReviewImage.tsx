import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FileIcon, ExternalLink } from 'lucide-react';

interface ReviewImageProps {
  label: string;
  file?: File | null;
}

export function ReviewImage({ label, file }: ReviewImageProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    if (file && file instanceof File) {
      url = URL.createObjectURL(file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setObjectUrl(url);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  const isPdf = file?.type === 'application/pdf';

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      {!file ? (
        <div className="flex items-center justify-center w-full h-32 bg-muted/30 border border-dashed rounded-md">
          <p className="text-xs text-muted-foreground italic">Not uploaded</p>
        </div>
      ) : (
        <div className="relative group overflow-hidden border rounded-md">
          {isPdf ? (
            <div className="flex flex-col items-center justify-center w-full h-32 bg-muted/50 p-4 text-center">
              <FileIcon className="w-8 h-8 text-primary mb-2" />
              <p className="text-xs font-medium truncate w-full px-2">{file.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="relative w-full h-32 bg-muted/20">
              {objectUrl && <Image src={objectUrl} alt={label} fill className="object-contain" />}
            </div>
          )}

          {objectUrl && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
              <a
                href={objectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white flex items-center text-sm font-medium hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
