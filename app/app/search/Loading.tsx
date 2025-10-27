import React from "react";

export default function Loading() {
    return (
        <>
            <div className="skeleton w-full h-8 my-3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
                <div className="skeleton h-32"></div>
            </div>
            <div className="skeleton w-full h-8 my-3"></div>
        </>
    );
}