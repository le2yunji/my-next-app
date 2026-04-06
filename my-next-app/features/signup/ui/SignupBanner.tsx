import Image from "next/image";
import Link from "next/link";

export default function SignupBanner() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 z-20 p-10 text-white">
        <Link className="text-5xl font-bold leading-tight" href={"/"}>
          MUTE
        </Link>
      </div>

      <Image
        src="/image/background2.webp"
        alt="그라데이션 배경사진"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-10 text-white">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] opacity-80">
          Welcome
        </p>
        <h2 className="text-4xl font-bold leading-tight">
          Archive your
          <br />
          own mood
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
          좋아하는 취향과 순간들을 저장하고, 감각적으로 공유해보세요.
        </p>
      </div>
    </div>
  );
}
