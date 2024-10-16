"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Label } from "@vevibe/ui";
import { Field, FieldError, InputConform } from "@vevibe/ui/form";
import { useRouter } from "next/navigation";
import { LoginSchema } from "~/schemas/auth-form.schema";
import { api } from "~/utils/api.util";
import { encryptPayload } from "~/utils/crypto.utils";

const SigninForm = () => {
  const router = useRouter();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    },

    onSubmit: async (e, { submission }) => {
      e.preventDefault();
      if (!submission || submission.status !== "success") return;

      const res = await api.auth.login.$post(
        {
          json: {
            email: encryptPayload(submission.value.email),
            password: encryptPayload(submission.value.password),
          },
        },
        { init: { credentials: "include" } },
      );

      if (res.status !== 200) return;

      router.push("/");

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
      <Button type="submit">Sign In</Button>
    </form>
  );
};

export default SigninForm;
