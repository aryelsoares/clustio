// Footer
"use client";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="px-[9%] py-4 bg-bg-second text-[1.4rem]">
            <p className="opacity-80">
                Copyright &copy; {currentYear} by Aryel | MIT License.
            </p>
        </footer>
    );
}