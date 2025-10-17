import Search from "./components/Search";
import {SearchParams} from "./models";

export default async function Page({searchParams}: { searchParams: Promise<SearchParams> }) {
    const {q, page, type} = await searchParams;

    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-5xl flex flex-col">
                <Search q={q} type={type} page={page}/>
            </main>
        </div>
    );
}