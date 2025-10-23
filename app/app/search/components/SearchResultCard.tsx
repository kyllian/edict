"use client";

import React, {FC, useState} from "react";
import Link from "next/link";
import ResultTitle from "./ResultTitle";
import ResultModal from "@/app/search/components/ResultModal";
import {SearchResult} from "@/app/search/models";

export interface SearchResultCardProps {
    result: SearchResult;
    highlightedName: React.ReactNode;
    highlightedText: React.ReactNode;
}

const SearchResultCard: FC<SearchResultCardProps> = ({result, highlightedName, highlightedText}) => {
    const modalId = `modal-${result.id}`;
    const [copied, setCopied] = useState(false);

    const copyLinkToClipboard = async () => {
        const path = result.type === 'glossary' ? `/glossary/${result.slug}` : `/rules/${result.slug}`;
        const fullUrl = `${window.location.origin}${path}`;
        const text = fullUrl.concat("\n\n", result.name, "\n", result.text);

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return <>
        <ResultModal result={result}
                     modalId={modalId}
                     highlightedName={highlightedName}
                     highlightedText={highlightedText}/>
        <div className="card card-xs">
            <div className="card-body">
                <h3 className="card-title">
                    <Link href={result.type === 'glossary' ? `/glossary/${result.slug}` : `/rules/${result.slug}`}
                          className="dropdown dropdown-hover dropdown-top w-full">
                        <div tabIndex={0}>
                            <div className="badge badge-xs mr-1 p-0 bg-transparent border-0">
                                {result.type.toLowerCase() === "glossary" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                                    </svg>) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"/>
                                    </svg>
                                )}
                            </div>
                            {highlightedName}
                        </div>
                        {result.title.length > 0 && (
                            <div tabIndex={-1}
                                 className="dropdown-content bg-neutral text-neutral-content rounded-box z-1 p-2 shadow-sm">
                                <ResultTitle title={result.title}/>
                            </div>
                        )}
                    </Link>

                    <button className="btn-sm p-0 border-0 p-1 cursor-pointer" onClick={() => {
                        const dlg = document.getElementById(modalId) as HTMLDialogElement | null;
                        if (dlg) dlg.showModal();
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                        </svg>
                    </button>

                    <button
                        className="btn-sm p-0 border-0 p-1 cursor-pointer relative"
                        onClick={copyLinkToClipboard}
                        title={copied ? "Copied!" : "Copy link to clipboard"}
                    >
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="size-6 text-success">
                                <path strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"/>
                            </svg>
                        ) : (<svg xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6">
                                <path strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                            </svg>
                        )}
                    </button>
                </h3>
                <p className="line-clamp-4" title={result.text}>
                    {highlightedText}
                </p>
            </div>
        </div>
    </>
};

export default SearchResultCard;
