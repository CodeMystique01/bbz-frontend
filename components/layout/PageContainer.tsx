interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    as?: React.ElementType;
}

export function PageContainer({ children, className, style, as: Tag = "div" }: PageContainerProps) {
    return (
        <Tag
            style={{
                maxWidth: 1100,
                marginLeft: "auto",
                marginRight: "auto",
                paddingLeft: 24,
                paddingRight: 24,
                ...style,
            }}
            className={className}
        >
            {children}
        </Tag>
    );
}
