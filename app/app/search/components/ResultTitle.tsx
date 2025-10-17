import React, {FC, ReactNode} from "react";

interface ResultTitleDropdownProps {
    title: string[];
}

const ResultTitle: FC<ResultTitleDropdownProps> = ({title}) => (
    <>
        {title.map((line, idx, arr) => (
            <div key={idx}>
                {line}
                {idx < arr.length - 1 && <br/>}
            </div>
        ))}</>
);

export default ResultTitle;

