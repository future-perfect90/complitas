type Props = {
    label: string;
    htmlFor?: string;
    className?: string
};

export default function Label({label, htmlFor = '', className = ''}: Props) {
    return (
        <label className={`block text-sm font-medium text-[#212529] dark:text-slate-300 ${className}`}
               htmlFor={htmlFor}>
            {label}
        </label>
    );
}
