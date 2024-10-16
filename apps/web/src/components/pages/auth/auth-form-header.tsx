type AuthFormHeaderProps = {
  title: string;
  description?: string;
};

const AuthFormHeader = ({ title, description }: AuthFormHeaderProps) => {
  return (
    <div className="block space-y-2">
      <h1 className="font-semibold text-2xl">{title}</h1>
      {!description ? null : <p className="text-primary/80 text-sm">{description}</p>}
    </div>
  );
};

export default AuthFormHeader;
