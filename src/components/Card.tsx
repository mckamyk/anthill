export default function Card({children, className}: {children: React.ReactNode, className?: string}) {
	return (
		<div className={ className + ` rounded-md p-2 bg-slate-800 bg-opacity-50 border-2 border-sky-800 transition-colors`}>
			{children}
		</div>
	)
}

