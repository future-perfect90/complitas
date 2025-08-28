/**
 * @typedef {object} CardProps
 * @property {React.ReactNode} children The content of the card.
 * @property {string} [className] Optional Tailwind CSS classes for custom styling.
 */

/**
 * A reusable Card component to contain content.
 * Styled with Tailwind for a clean, modern look.
 * @param {CardProps} props The component props.
 */
function Card({ children, className = '' }) {
	return (
		<div
			className={`rounded-2xl border bg-card text-card-foreground shadow-lg dark:bg-gray-800 dark:border-gray-700 ${className}`}>
			{children}
		</div>
	);
}

/**
 * @typedef {object} CardHeaderProps
 * @property {React.ReactNode} children The content of the card header.
 * @property {string} [className] Optional Tailwind CSS classes for custom styling.
 */

/**
 * CardHeader is a component for the top section of a Card.
 * @param {CardHeaderProps} props The component props.
 */
function CardHeader({ children, className = '' }) {
	return (
		<div
			className={`flex flex-col space-y-1.5 p-6 border-b dark:border-gray-700 ${className}`}>
			{children}
		</div>
	);
}

/**
 * @typedef {object} CardTitleProps
 * @property {React.ReactNode} children The content of the card title.
 * @property {string} [className] Optional Tailwind CSS classes for custom styling.
 */

/**
 * CardTitle is a component for the title within a CardHeader.
 * @param {CardTitleProps} props The component props.
 */
function CardTitle({ children, className = '' }) {
	return (
		<h3
			className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
			{children}
		</h3>
	);
}

/**
 * @typedef {object} CardContentProps
 * @property {React.ReactNode} children The content of the card content area.
 * @property {string} [className] Optional Tailwind CSS classes for custom styling.
 */

/**
 * CardContent is the main content area for a Card.
 * @param {CardContentProps} props The component props.
 */
function CardContent({ children, className = '' }) {
	return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export { Card, CardContent, CardHeader, CardTitle };
