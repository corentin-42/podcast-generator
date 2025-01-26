'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(`user_${Date.now()}.pdf`, file);

      if (error) {
        console.error("Erreur d'upload :", error);
        return;
      }

      await supabase.functions.invoke('process-document', {
        body: { filePath: data.path },
      });
    } catch (error) {
      console.error("Erreur lors du traitement :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Générateur de Podcast</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border border-gray-300 p-2 rounded"
          accept=".pdf"
        />
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`px-4 py-2 rounded ${
            loading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          {loading ? 'Génération en cours...' : 'Générer le podcast'}
        </button>
      </div>
    </div>
  );
}
