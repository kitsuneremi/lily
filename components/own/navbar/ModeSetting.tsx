import { useTheme } from "next-themes";
import MenuItem from "./MenuItem";
const Collapse = ({
    trigger,
    content,
}: {
    trigger: React.ReactNode;
    content: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col gap-1 w-max group/box">
            <div>{trigger}</div>
            {<div className="hidden group-hover/box:block hover:bg-transparent hover:block">{content}</div>}
        </div>
    );
};

const LightModeSetting = () => {

    const { theme, setTheme } = useTheme();

    return (
        <Collapse
            trigger={
                <MenuItem className="text-start">Chế độ sáng</MenuItem>
            }
            content={
                <div className="flex flex-col w-full rounded-sm text-start">
                    <button
                        onClick={() => {
                            setTheme("light");
                        }}
                        className="text-start py-1 pl-5 hover:bg-slate-200 hover:text-slate-800 rounded-md"
                    >
                        Sáng
                    </button>
                    <button
                        onClick={() => {
                            setTheme("dark");
                        }}
                        className="text-start py-1 pl-5 hover:bg-slate-600 rounded-md hover:text-white"
                    >
                        Tối
                    </button>
                    <button
                        onClick={() => {
                            setTheme("system");
                        }}
                        className="text-start py-1 pl-5 hover:bg-gradient-to-r from-slate-200 to-slate-600 rounded-md hover:text-white"
                    >
                        Hệ thống
                    </button>
                </div>
            }
        />
    );
}

export default LightModeSetting;