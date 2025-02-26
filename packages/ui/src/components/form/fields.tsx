export const Field = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export const FieldError = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-red-600 text-sm">{children}</div>;
};
