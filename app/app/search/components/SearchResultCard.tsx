import {FC} from "react";
import {SearchResultCardProps} from "@/app/search/models";
import ResultTitle from "./ResultTitle";

const SearchResultCard: FC<SearchResultCardProps> = ({result, highlightedName, highlightedText}) => (
    <div className="card card-xs">
        <div className="card-body">
            <h3 className="card-title">
                <div className="dropdown dropdown-hover dropdown-top w-full">
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
                        <div tabIndex={-1} className="dropdown-content bg-neutral rounded-box z-1 p-2 shadow-sm">
                            <ResultTitle title={result.title}/>
                        </div>
                    )}
                </div>
            </h3>
            <p className="line-clamp-4" title={result.text}>
                {highlightedText}
            </p>
        </div>
    </div>
);

export default SearchResultCard;
