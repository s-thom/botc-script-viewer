import { Field } from "@base-ui-components/react/field";
import { Form } from "@base-ui-components/react/form";
import { useCallback, useState, type FormEventHandler } from "react";
import styles from "../../css/home.module.css";
import type { BloodOnTheClocktowerCustomScript } from "../../generated/script-schema";
import { compressToBase64, encodeUrlSafeBase64 } from "../../lib/compression";

export function CustomScriptForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});

  const doAsync = useCallback(async (cb: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await cb();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrors({ value: "Error trying to process script" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const value = formData.get("value");
      if (typeof value !== "string") {
        setErrors({ value: "Please enter the script JSON or URL" });
        return;
      }

      const url = URL.parse(value);
      if (url !== null) {
        if (url.hostname === window.location.hostname) {
          location.assign(url);
          return;
        }

        // Check if it's a link to the scripts website
        if (url.hostname === "botc-scripts.azurewebsites.net") {
          const jsonPathMatch = url.pathname.match(
            /^\/api\/scripts\/(\d+)\/json\//,
          );
          if (jsonPathMatch) {
            window.location.assign(`/s/${jsonPathMatch[1]}`);
            return;
          }
        }

        window.location.assign(`/u/${encodeURIComponent(url.toString())}`);
        return;
      }

      let json: BloodOnTheClocktowerCustomScript;
      try {
        json = JSON.parse(value);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setErrors({ value: "Value is not valid JSON" });
        return;
      }

      const minified = JSON.stringify(json);

      // Try compress the data before shoving it all in the URL
      if ("CompressionStream" in window) {
        await doAsync(async () => {
          const compressedBase64 = await compressToBase64(minified);
          window.location.assign(`/gz/${compressedBase64}`);
        });
        return;
      }

      const uncompressedBase64 = encodeUrlSafeBase64(minified);
      (window as Window).location.assign(`/uncompressed/${uncompressedBase64}`);
    },
    [doAsync],
  );

  return (
    <Form
      className={styles.Form}
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={onSubmit}
    >
      <Field.Root name="value" className={styles.Field}>
        <Field.Label className={styles.Label}>Script JSON or URL</Field.Label>
        <Field.Control className={styles.Input} render={<textarea />} />
        <Field.Error className={styles.Error} />
      </Field.Root>
      <button type="submit" className={styles.Button} disabled={isLoading}>
        View script
      </button>
    </Form>
  );
}
