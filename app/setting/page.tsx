import { redirect } from "next/navigation";

export default function Page() {
    return (
        <div>
            {redirect('/setting/account')}
        </div>
    )

}