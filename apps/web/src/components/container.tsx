import { cn } from "@vevibe/ui";
import type { ComponentProps } from "react";

const Container = ({ children, className, ...props }: ComponentProps<"div">) => {
  return (
    <div className={cn("grid min-h-dvh w-dvw", className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
