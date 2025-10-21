import Form from 'next/form'
import SearchInput from './search/components/SearchInput'
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-2xl pt-[30vh] prose px-4">
                <article className="text-right">
                    <p>Magic: the Gathering <br/>Rules Search</p>
                </article>
                <Form action="/search">
                    <SearchInput q={""}/>
                    <div className="navbar p-0">
                        <div className="flex-1"></div>
                        <Link href="https://github.com/kyllian/edict"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost btn-sm">
                            <Image src="/github-mark-white.svg" alt="GitHub" width={22} height={22} className="m-0"/>
                        </Link>
                        <Link href="https://forms.gle/GWu7heW1jaGKg1WG8"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline btn-sm">
                            Feedback
                        </Link>
                    </div>
                </Form>
            </main>
        </div>
    );
}
