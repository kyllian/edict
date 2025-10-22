import React, {FC, useState, useEffect, useRef} from "react";
import ResultTitle from "./ResultTitle";
import {SearchResult} from "@/app/search/models";
import Link from "next/link";

type ModalData = DefinitionResult | RuleResult | null;

export interface ResultModalProps {
    result: SearchResult;
    modalId?: string;
    highlightedName: React.ReactNode;
    highlightedText: React.ReactNode;
}

export interface DefinitionResult {
    id: string;
    term: string;
    text: string;
    rules: RuleResult[];
}

export interface RuleResult {
    id: string;
    number: string;
    text: string;
    rules: RuleResult[];
    references: RuleResult[];
    slug?: string | null;
    section: string | null;
    subsection: string | null;
    ruleNumber: string | null;
    ruleText: string | null;
}

const ResultModal: FC<ResultModalProps> = ({result, modalId, highlightedName, highlightedText}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [modalData, setModalData] = useState<ModalData>(null);
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const id = modalId ?? `modal-${result.id}`;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleOpen = () => {
            if (!dialog.open) return;
            setIsLoading(true);
            setModalData(null);
            setError(null);

            let endpoint = "";
            if (result.type === "glossary") {
                endpoint = `/api/glossary/${result.id}`;
            } else if (result.type === "rules") {
                endpoint = `/api/rules/${result.id}`;
            } else {
                setIsLoading(false);
                setError("Unknown result type.");
                return;
            }

            fetch(endpoint)
                .then(async (res) => {
                    if (!res.ok) throw new Error("Not found");
                    return res.json();
                })
                .then((data) => {
                    data.rules.sort((a: RuleResult, b: RuleResult) =>
                        a.number.replace(".", "")
                            .localeCompare(
                                b.number.replace(".", ""),
                                undefined,
                                {numeric: true})
                    ); // sort alphanumerically by rule number
                    setModalData(data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setError("Failed to load related data.");
                    setIsLoading(false);
                });
        };

        if (dialog.open) {
            handleOpen();
        }

        dialog.addEventListener('toggle', handleOpen);
        return () => {
            dialog.removeEventListener('toggle', handleOpen);
        };
    }, [modalId, result.id, result.type]);

    function isDefinitionResult(data: ModalData): data is DefinitionResult {
        return !!data && 'term' in data;
    }

    function isRuleResult(data: ModalData): data is RuleResult {
        return !!data && 'number' in data && !('term' in data);
    }

    return (
        <dialog ref={dialogRef} id={id} className="modal px-5">
            <div className="modal-box w-11/12 max-w-xl mb-5 max-h-[80vh]">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="prose prose-sm">
                    <section>
                        {result.title && <h4><ResultTitle title={result.title}/></h4>}
                        <h4>{highlightedName}</h4>
                        <p>{highlightedText}</p>
                    </section>

                    {isLoading ? (
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="skeleton h-4 w-3/9"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : isDefinitionResult(modalData) ? (
                        <div className="mt-4">
                            {(modalData.rules?.length ?? 0) > 0 && (
                                <ul className="list">
                                    {modalData.rules.map(rule => (
                                        <li key={rule.id} className="list-row">
                                            <Link href={`/rules/${rule.slug}`}
                                                  className="font-bold opacity-85 tabular-nums">
                                                {rule.number}
                                            </Link>
                                            <div className="list-col-grow">
                                                <div className="opacity-60">{rule.text}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : isRuleResult(modalData) ? (
                        <>
                            {(modalData.rules?.length ?? 0) > 0 && (
                                <ul className="list">
                                    {modalData.rules.map(rule => (
                                        <li key={rule.id} className="list-row">
                                            <Link href={`/rules/${rule.slug}`}
                                                  className="font-bold opacity-85 tabular-nums">
                                                {rule.number}
                                            </Link>
                                            <div className="list-col-grow">
                                                <div className="opacity-60">{rule.text}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {(modalData.references?.length ?? 0) > 0 && (
                                <>
                                    <h4>References</h4>
                                    <ul className="list">
                                        {modalData.references.map(rule => (
                                            <li key={rule.id} className="list-row">
                                                <Link href={`/rules/${rule.slug}`}
                                                      className="font-bold opacity-85 tabular-nums">
                                                    {rule.number}
                                                </Link>
                                                <div className="list-col-grow">
                                                    <div className="opacity-60">{rule.text}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ResultModal;
