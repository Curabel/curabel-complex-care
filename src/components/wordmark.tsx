import Image from "next/image";

export function Wordmark() {
  return <Image className="official-logo" src="/images/curabel-official-logo.jpg" alt="Curabel Complex Care Group" width={1254} height={1254} sizes="(max-width: 700px) 120px, 180px" />;
}
