export function setupUploadForm(
  form: HTMLFormElement,
  fileInput: HTMLInputElement,
  fileInputLabel: HTMLLabelElement,
  statusRegion: HTMLDivElement,
) {
  function submitForm() {
    if ("requestSubmit" in form) {
      const submitButton = form.querySelector<HTMLButtonElement>(
        'button:not([type]),button[type="submit"],input[type="submit"]',
      );
      if (submitButton) {
        form.requestSubmit(submitButton);
        return;
      }
    }

    form.submit();
  }

  function updateLabelWithFile(file: File | null) {
    if (!file) {
      fileInputLabel.textContent = "Select JSON file to upload.";
      statusRegion!.textContent = "";
      return;
    }
    fileInputLabel.textContent = file.name;
    statusRegion!.textContent = `Selected file: ${file.name}`;
  }

  fileInput.addEventListener("change", () => {
    if (!fileInput.files || fileInput.files.length === 0) {
      updateLabelWithFile(null);
      return;
    }

    const file = fileInput.files[0];
    updateLabelWithFile(file);

    submitForm();
  });

  const dragClass = "dragover";
  const dragErrorClass = "dragerror";
  function preventAndStop(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  function isJsonFile(file: File | null): file is File {
    if (!file) {
      return false;
    }

    return (
      file.type === "application/json" ||
      file.name.toLowerCase().endsWith(".json")
    );
  }

  function getFirstValidFileFromDrag(e: DragEvent | null): File | null {
    if (!e || !e.dataTransfer) return null;
    const dt = e.dataTransfer;

    // Prefer actual File objects when available
    if (dt.files && dt.files.length > 0) {
      for (const file of dt.files) {
        if (isJsonFile(file)) {
          return file;
        }
      }

      return null;
    }

    if (dt.items && dt.items.length > 0) {
      for (const item of dt.items) {
        if (item.kind !== "file") {
          continue;
        }

        if (item.type === "application/json") {
          return new File([], "script.json", { type: "application/json" });
        }
      }
    }

    return null;
  }

  function onDragOver(e: DragEvent) {
    preventAndStop(e);

    const file = getFirstValidFileFromDrag(e);

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = file ? "copy" : "none";
    }

    if (file) {
      fileInputLabel.classList.add(dragClass);
      fileInputLabel.classList.remove(dragErrorClass);
    } else {
      fileInputLabel.classList.add(dragErrorClass);
      fileInputLabel.classList.remove(dragClass);
    }
  }

  function onDragLeave(e: DragEvent) {
    preventAndStop(e);

    fileInputLabel.classList.remove(dragClass);
    fileInputLabel.classList.remove(dragErrorClass);
  }

  function onDrop(e: DragEvent) {
    preventAndStop(e);

    fileInputLabel.classList.remove(dragClass);
    fileInputLabel.classList.remove(dragErrorClass);

    const file = getFirstValidFileFromDrag(e);

    if (!file) {
      fileInput.value = "";
      updateLabelWithFile(null);
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    updateLabelWithFile(file);

    submitForm();
  }

  fileInputLabel.addEventListener("dragover", onDragOver);
  fileInputLabel.addEventListener("dragenter", onDragOver);
  fileInputLabel.addEventListener("dragleave", onDragLeave);
  fileInputLabel.addEventListener("drop", onDrop);
}
