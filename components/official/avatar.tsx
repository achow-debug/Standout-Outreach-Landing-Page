import Image from "next/image";

function initialsFromName(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.at(-1)?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
}

type AvatarProps = {
  name: string;
  photo?: string | null;
  alt?: string;
};

/** 48px circle. Initials stand in until a photo is supplied. */
export function Avatar({ name, photo, alt }: AvatarProps) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={alt ?? ""}
        width={48}
        height={48}
        className="avatar"
      />
    );
  }

  return (
    <span className="avatar avatar--initials" aria-hidden="true">
      {initialsFromName(name)}
    </span>
  );
}
