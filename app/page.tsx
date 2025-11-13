import Link from "next/link";



export default function Home() {
    return (
        <div className="min-h-screen flex justify-center items-center gap-64">
            <h1 className="text-2xl">Ordinary notes,<br />done <em>extraordinarily</em></h1>
            <Link href="/auth"><button>Get me in {"→"}</button></Link>
        </div>
    )
}