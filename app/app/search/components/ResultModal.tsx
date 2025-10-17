import {FC, useState, useEffect, useRef} from "react";
import {ResultModalProps, DefinitionResult, RuleResult} from "@/app/search/models";
import ResultTitle from "./ResultTitle";

type ModalData = DefinitionResult | RuleResult | null;

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
                    setModalData(data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setError("Failed to load data.");
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
        <dialog ref={dialogRef} id={id} className="modal xs-modal-bottom sm:modal-top md:modal-end">
            <div className="modal-box w-11/12 max-w-5xl">
                <div className="prose">
                    {result.title && <h2><ResultTitle title={result.title}/></h2>}
                    <h3>{highlightedName}</h3>
                    <p>{highlightedText}</p>
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
                            {modalData.rules && modalData.rules.length > 0 && (
                                <div className="mt-2">
                                    <ul>
                                        {modalData.rules.map(rule => (
                                            <li key={rule.id}>
                                                {rule.number}: {rule.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : isRuleResult(modalData) ? (
                        <div className="mt-4">
                            {modalData && modalData.rules.length > 0 && (
                                <div className="mt-2">
                                    <ul>
                                        {modalData.rules.map(rule => (
                                            <li key={rule.id}>
                                                {rule.number}: {rule.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
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
