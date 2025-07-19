import { Field } from "@base-ui-components/react/field";
import { Form } from "@base-ui-components/react/form";
import { useCallback, useState, type FormEventHandler } from "react";
import formStyles from "../../css/form.module.css";

export function CustomScriptForm() {
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});

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
      }

      // It's JSON, which means we're going async.
    },
    [],
  );

  return (
    <Form
      className={formStyles.Form}
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={onSubmit}
    >
      <Field.Root name="value" className={formStyles.Field}>
        <Field.Label className={formStyles.Label}>
          Script JSON or URL
        </Field.Label>
        <Field.Control className={formStyles.Input} render={<textarea />} />
        <Field.Error className={formStyles.Error} />
      </Field.Root>
      <button type="submit" className={formStyles.Button}>
        View script
      </button>
    </Form>
  );
}
