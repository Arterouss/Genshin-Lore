/**
 * Layanan Penerjemah Khusus Naskah Lore Teyvat
 * Menerjemahkan HANYA isi naskah cerita dan intisari ke Bahasa Indonesia
 * 100% Gratis, tanpa API Key, tanpa merusak navbar/menu web.
 */

// Terjemahkan sepotong teks tunggal
export async function translateTextToId(text: string): Promise<string> {
  if (!text || text.trim() === "") return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(url);
    if (!res.ok) return text;

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item: [string, string]) => item[0]).join("");
    }
    return text;
  } catch (err) {
    console.error("Gagal menerjemahkan teks:", err);
    return text;
  }
}

// Terjemahkan dokumen HTML (memproses paragraf, heading, dan list tanpa merusak tag HTML)
export async function translateHtmlToId(html: string): Promise<string> {
  if (typeof window === "undefined" || !html) return html;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Ambil elemen-elemen teks bermakna
    const textNodes = Array.from(
      doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6, p, blockquote, li, .cn-context")
    );

    // Kumpulkan teks untuk diterjemahkan
    const textsToTranslate: { el: Element; text: string }[] = [];
    for (const el of textNodes) {
      const trimmed = el.textContent?.trim();
      // Jangan terjemahkan jika kosong atau angka pendek
      if (trimmed && trimmed.length > 2) {
        textsToTranslate.push({ el, text: trimmed });
      }
    }

    // Terjemahkan dalam batch beberapa paragraf sekaligus agar cepat
    const BATCH_SIZE = 6;
    for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
      const batch = textsToTranslate.slice(i, i + BATCH_SIZE);
      const combinedText = batch.map((item) => item.text).join("\n===SPLIT===\n");

      try {
        const translatedCombined = await translateTextToId(combinedText);
        const translatedParts = translatedCombined.split(/=== ?SPLIT ?===/i);

        batch.forEach((item, idx) => {
          if (translatedParts[idx]) {
            // Ganti isi teks elemen dengan hasil terjemahan
            item.el.textContent = translatedParts[idx].trim();
          }
        });
      } catch (e) {
        console.warn("Gagal menerjemahkan batch paragraf:", e);
      }
    }

    return doc.body.innerHTML;
  } catch (err) {
    console.error("Gagal memproses HTML untuk terjemahan:", err);
    return html;
  }
}
