import Link from "next/link";

type AuthLinkProps = {
  text: string;
  href: string;
  linkText: string;
};

const AuthLink = ({ text, href, linkText }: AuthLinkProps) => {
  return (
    <div className="mx-auto inline-block space-x-1 text-sm">
      <span>{text}</span>
      <Link href={href} prefetch={false} className="font-semibold hover:underline">
        {linkText}
      </Link>
    </div>
  );
};

export default AuthLink;
