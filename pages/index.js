import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(\user_\.pdf\, file);

    if (error) {
      console.error("Erreur d'upload :", error);
      setLoading(false);
    } else {
      await supabase.functions.invoke('process-document', {
        body: { filePath: data.path },
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Générateur de Podcast</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Génération en cours...' : 'Générer le podcast'}
      </button>
    </div>
  );
}
