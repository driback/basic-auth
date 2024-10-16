import { getInputProps, type FieldMetadata } from "@conform-to/react";
import type { ComponentProps } from "react";
import { Input } from "../input";

export const InputConform = ({
  meta,
  type,
  ...props
}: {
  meta: FieldMetadata<string>;
  type: Parameters<typeof getInputProps>[1]["type"];
} & ComponentProps<typeof Input>) => {
  return <Input {...getInputProps(meta, { type, ariaAttributes: true })} {...props} />;
};
