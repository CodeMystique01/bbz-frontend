import Image from "next/image";

interface BrandLogoProps {
    size?: number;
}

export function BrandLogo({ size = 36 }: BrandLogoProps) {
    return (
        <Image
            src="/logo.png"
            alt="BuyBizz"
            width={size}
            height={size}
            style={{ objectFit: "contain" }}
            priority
        />
    );
}
