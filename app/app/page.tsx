import Form from 'next/form'
import SearchInput from './search/components/SearchInput'

export default async function Home() {
    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-2xl pt-[10vh] md:pt-[30vh] prose">
                <h2 className="ml-4">
                    Magic: the Gathering rules and glossary terms
                </h2>
                <Form action="/search">
                    <SearchInput q={""}/>
                </Form>
            </main>
        </div>
    );
}
