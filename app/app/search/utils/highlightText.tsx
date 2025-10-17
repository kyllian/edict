import { ReactNode } from "react";

export function highlightText(text: string, highlights: string[]): ReactNode {
    if (!highlights || highlights.length === 0) return text;
    const sorted = [...highlights].sort((a, b) => b.length - a.length);
    let parts: (string | {highlight: string})[] = [text];
    for (const h of sorted) {
        let newParts: (string | {highlight: string})[] = [];
        for (const part of parts) {
            if (typeof part === 'string') {
                const split = part.split(h);
                for (let i = 0; i < split.length; i++) {
                    if (split[i]) newParts.push(split[i]);
                    if (i < split.length - 1) newParts.push({highlight: h});
                }
            } else {
                newParts.push(part);
            }
        }
        parts = newParts;
    }
    return parts.map((part, i) =>
        typeof part === 'string'
            ? part
            : <span key={i} className="bg-info text-info-content px-px">{part.highlight}</span>
    );
}

