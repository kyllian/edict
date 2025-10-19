import Form from 'next/form'
import SearchInput from './search/components/SearchInput'

export default async function Home() {
    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-2xl pt-[30vh] prose">
                <h2 className="ml-2">
                    Magic: the Gathering rules and glossary terms
                </h2>
                <Form action="/search">
                    <SearchInput q={""}/>
                    <a href="https://github.com/kyllian/edict/issues/new"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="btn btn-outline btn-sm">
                        Feedback
                    </a>
                </Form>
            </main>
        </div>
    );
}
