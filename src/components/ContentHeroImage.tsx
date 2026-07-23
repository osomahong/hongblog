import Image from "next/image";

interface ContentHeroImageProps {
    /** 대표 이미지 경로 (보통 /og/{slug}.png) */
    src: string;
    /** 이미지를 설명하는 대체 텍스트 */
    alt: string;
}

/**
 * 글 본문 최상단의 대표 이미지.
 *
 * og:image는 메타 태그에만 있어서 페이지에 실제로 그려지지 않는다. 그러면 구글 이미지는
 * 페이지에 그려진 다른 이미지(관련 글 카드의 남의 썸네일 등)를 이 글의 대표로 오인한다.
 * 대표 이미지를 본문에 노출해 어떤 이미지가 이 글의 것인지 분명히 한다.
 */
export function ContentHeroImage({ src, alt }: ContentHeroImageProps) {
    return (
        <figure className="mb-4 sm:mb-8">
            <Image
                src={src}
                alt={alt}
                width={1200}
                height={630}
                priority
                sizes="(max-width: 640px) 100vw, 768px"
                className="w-full h-auto border-2 sm:border-3 border-black sm:neo-shadow-sm"
            />
        </figure>
    );
}
