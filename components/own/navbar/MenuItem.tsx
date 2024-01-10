import { cn } from "@/lib/utils";
const MenuItem = ({
    children,
    className,
    ...props
}: React.HTMLProps<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                "w-full px-3 py-3 rounded-sm cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700",
                className
            )}
            {...props}
        >
            <p className="w-full min-w-[160px] select-none">{children}</p>
        </div>
    );
};

export default MenuItem;