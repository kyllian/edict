import {FC} from "react";
import {SearchResultsProps} from "@/app/search/models";
import SearchResultCard from "./SearchResultCard";
import ResultModal from "./ResultModal";
import { highlightText } from "../utils/highlightText";

const Results: FC<SearchResultsProps> = ({results}) => (
    <div className="mb-4 mt-1">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 auto-rows-auto">
            {results.map((result) => {
                const modalId = `modal-${result.id}`;
                const highlightedName = highlightText(result.name, result.nameHighlights);
                const highlightedText = highlightText(result.text, result.textHighlights);
                return (
                    <div key={result.id}>
                        <ResultModal result={result} modalId={modalId} highlightedName={highlightedName} highlightedText={highlightedText} />
                        <div className="cursor-pointer" onClick={() => {
                            const dlg = document.getElementById(modalId) as HTMLDialogElement | null;
                            if (dlg) dlg.showModal();
                        }}>
                            <SearchResultCard result={result} highlightedName={highlightedName} highlightedText={highlightedText}/>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default Results;
