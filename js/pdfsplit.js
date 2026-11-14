// =========================
// PDF SPLIT TOOL (browser port of pdf_split.py)
// =========================
(() => {
  const zone = document.getElementById("drop-zone");
  const input = document.getElementById("pdf-input");
  const errorEl = document.getElementById("tool-error");
  const result = document.getElementById("tool-result");
  const filenameEl = document.getElementById("tool-filename");
  const oddLink = document.getElementById("download-odd");
  const evenLink = document.getElementById("download-even");
  const bothLink = document.getElementById("download-both");
  const steps = document.getElementById("tool-steps");

  if (!zone || !input) return;

  let objectUrls = [];

  function releaseUrls() {
    objectUrls.forEach((u) => URL.revokeObjectURL(u));
    objectUrls = [];
  }

  function showError(message) {
    releaseUrls();
    result.hidden = true;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function blobUrl(bytes, type = "application/pdf") {
    const url = URL.createObjectURL(new Blob([bytes], { type }));
    objectUrls.push(url);
    return url;
  }

  async function extractPages(src, pageIndexes) {
    const doc = await PDFLib.PDFDocument.create();
    const pages = await doc.copyPages(src, pageIndexes);
    pages.forEach((p) => doc.addPage(p));
    return doc.save();
  }

  async function splitPdf(file) {
    errorEl.hidden = true;
    result.hidden = true;

    const isPdf =
      file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      showError("That doesn't look like a PDF file.");
      return;
    }

    zone.classList.add("busy");

    try {
      const buffer = await file.arrayBuffer();

      let src;
      try {
        src = await PDFLib.PDFDocument.load(buffer);
      } catch (err) {
        if (/encrypted/i.test(String(err))) {
          showError("This PDF is encrypted. Unlock it before splitting.");
        } else {
          showError("Couldn't read this file as a PDF — it may be corrupted.");
        }
        return;
      }

      const pageCount = src.getPageCount();
      const stem = file.name.replace(/\.pdf$/i, "");

      const oddIndexes = [];
      for (let i = 0; i < pageCount; i += 2) oddIndexes.push(i);

      // Even pages print back-to-front: after printing the odds and
      // flipping the stack, sheet order is reversed, so the last even
      // page must come first in the file and page 2 must come last.
      const evenIndexes = [];
      for (let i = 1; i < pageCount; i += 2) evenIndexes.unshift(i);

      releaseUrls();

      const oddBytes = await extractPages(src, oddIndexes);
      oddLink.href = blobUrl(oddBytes);
      oddLink.download = `${stem}_odd.pdf`;
      oddLink.querySelector("span").textContent =
        `Odd pages (${oddIndexes.length})`;

      if (evenIndexes.length) {
        const evenBytes = await extractPages(src, evenIndexes);
        evenLink.href = blobUrl(evenBytes);
        evenLink.download = `${stem}_even.pdf`;
        evenLink.querySelector("span").textContent =
          `Even pages (${evenIndexes.length})`;
        evenLink.hidden = false;
        steps.hidden = false;

        // Zip mirrors the CLI's output: a print_<name>/ folder holding
        // both files. Zero compression — PDFs barely deflate, and store
        // keeps big files fast.
        const zipBytes = fflate.zipSync(
          {
            [`print_${stem}/${stem}_odd.pdf`]: oddBytes,
            [`print_${stem}/${stem}_even.pdf`]: evenBytes,
          },
          { level: 0 }
        );
        bothLink.href = blobUrl(zipBytes, "application/zip");
        bothLink.download = `print_${stem}.zip`;
        bothLink.hidden = false;
      } else {
        evenLink.hidden = true;
        bothLink.hidden = true;
        steps.hidden = true;
      }

      filenameEl.textContent =
        `${file.name} — ${pageCount} page${pageCount === 1 ? "" : "s"}` +
        (evenIndexes.length ? "" : " (nothing to print on the back)");
      result.hidden = false;
    } catch (err) {
      showError("Something went wrong while splitting this PDF.");
    } finally {
      zone.classList.remove("busy");
    }
  }

  // Click / keyboard opens the file picker
  zone.addEventListener("click", () => input.click());
  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      input.click();
    }
  });

  input.addEventListener("change", () => {
    if (input.files.length) splitPdf(input.files[0]);
    input.value = "";
  });

  // Drag and drop
  ["dragenter", "dragover"].forEach((type) => {
    zone.addEventListener(type, (e) => {
      e.preventDefault();
      zone.classList.add("dragover");
    });
  });
  ["dragleave", "drop"].forEach((type) => {
    zone.addEventListener(type, (e) => {
      e.preventDefault();
      zone.classList.remove("dragover");
    });
  });
  zone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) splitPdf(file);
  });
})();
