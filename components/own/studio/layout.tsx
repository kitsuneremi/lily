export default function MyComponent({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-5 flex-1 overflow-hidden">
            {children}
        </div>
    );
}
