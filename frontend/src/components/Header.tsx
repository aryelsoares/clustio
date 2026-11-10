// Header
"use client";

import { useRef } from "react";
import Image from "next/image";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faEraser } from "@fortawesome/free-solid-svg-icons";

interface Btn {
    name: string,
    icon: IconDefinition;
    onClick?: () => void;
    requiresFilled: boolean;
}

interface HeaderProps {
    filename: string;
    onInsert: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInject: () => void;
    onReset: () => void;
    loading: string | null;
    filled: boolean;
}

export default function Header({ filename, onInsert, onInject, onReset, loading, filled }: HeaderProps) {
    const version = "v1.0";

    const fileInputRef = useRef<HTMLInputElement>(null);

    const buttons: Btn[] = [
        { name: "Insert", icon: faArrowUp, requiresFilled: false },
        { name: "Inject", icon: faArrowDown, onClick: onInject, requiresFilled: true },
        { name: "Reset", icon: faEraser, onClick: onReset, requiresFilled: true }
    ];

    return (
        <header className="px-[9%] py-4 bg-bg-second text-[1.4rem] mb-8">
            <div className="flex items-center justify-between gap-6">
                {/* Logo */}
                <a href="#" className="flex items-center gap-4">
                    <Image
                        title="Icon"
                        alt="Icon"
                        src={"icon.svg"}
                        width="30"
                        height="30"
                    />
                    <p className="font-semibold">
                        Clustio · {version}
                    </p>
                </a>

                {/* Title */}
                <p className="font-semibold">
                    Current File: {filename}
                </p>

                {/* File input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={onInsert}
                />
                {/* Buttons */}
                <div className="flex items-center gap-12">
                    {buttons.map(({ name, icon, onClick, requiresFilled }, index) => {
                        const isLoading = loading === name;
                        const disabled = loading !== null || (requiresFilled && !filled);

                        const handleClick = () => {
                            if (name === "Insert") {
                                fileInputRef.current?.click();
                                return;
                            }

                            onClick?.();
                        }

                        return (
                            <button
                                key={name}
                                title={name}
                                onClick={handleClick}
                                disabled={disabled}
                                className={`
                                    relative
                                    flex items-center justify-center
                                    w-32 h-12
                                    rounded-full
                                    text-text
                                    bg-bg-third
                                    transition-all duration-300
                                    ${disabled
                                        ? "opacity-60"
                                        : "cursor-pointer hover:text-main hover:shadow-[0_0_1.5rem_#444546]"
                                    }
                                    ${index !== buttons.length - 1
                                        ? "after:content-[''] after:absolute after:-right-6 after:top-1/2 after:-translate-y-1/2 after:h-10 after:w-px after:bg-bg-third"
                                        : ""
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <svg aria-hidden="true" role="status" className="inline w-6 sm:w-7 h-auto mr-2 animate-spin text-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                                        </svg>
                                        {name}
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={icon} className="mr-2" aria-hidden="true" />
                                        {name}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}