"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Label } from "@vevibe/ui";
import { Field, FieldError, InputConform } from "@vevibe/ui/form";
import { SignupSchema } from "~/schemas/auth-form.schema";
import { api } from "~/utils/api.util";
import { encryptPayload } from "~/utils/crypto.utils";

const SignupForm = () => {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupSchema });
    },

    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (!submission || submission.status !== "success") return;

      await api.auth.signup.$post({
        json: {
          email: encryptPayload(submission.value.email),
          password: encryptPayload(submission.value.password),
        },
      });

      return;
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} className="flex flex-col gap-8" noValidate>
      <div className="space-y-6">
        <Field>
          <Label htmlFor={fields.email.id} className="text-primary/70 text-sm">
            Email
          </Label>
          <InputConform
            type="email"
            key={fields.email.key}
            meta={fields.email}
            placeholder="me@example.com"
          />
          {fields.email.errors && <FieldError>{fields.email.errors}</FieldError>}
        </Field>
        <Field>
          <Label htmlFor={fields.password.id} className="text-primary/70 text-sm">
            Password
          </Label>
          <InputConform
            type="password"
            key={fields.password.key}
            meta={fields.password}
            placeholder="********"
          />
          {fields.password.errors && <FieldError>{fields.password.errors}</FieldError>}
        </Field>
      </div>
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignupForm;
