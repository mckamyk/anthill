export default function Card({children}: {children: React.ReactNode}) {
	return (
		<div className="flex items-center justify-center">
			<div className="rounded-md flex flex-col items-center justify-center p-2 bg-slate-800 bg-opacity-50 border-2 border-sky-800">
				{children}
			</div>
		</div>
	)
}

