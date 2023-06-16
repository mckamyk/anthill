"use client"
import React, { createContext, useCallback, useEffect, useState } from "react";
import CloseIcon from "@heroicons/react/20/solid/XMarkIcon"

let id = 0;

const ToastsContext = createContext({
	addToast: (toast: NewToast) => {},
	removeToast: (id: number) => {},
});

export default function ToastProvider({children}: {children: React.ReactNode}) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((toast: NewToast) => {
		const thisId = id++;
		setToasts(ts => [
			...ts,
			{
				...toast,
				id: thisId,
				timer: setTimeout(() => {
					removeToast(thisId);
				}, 4000),
			}
		])
	}, [setToasts])

	const removeToast = useCallback((id: number) => {
		setToasts(ts => ts.filter(t => t.id !== id))
	}, [setToasts])

	return (
		<ToastsContext.Provider value={{addToast, removeToast}}>
			<div className="absolute right-10 bottom-10 flex flex-col gap-3">
				{toasts.map((t, i) => (
					<Toast key={i} {...t} />
				))}
			</div>
			{children}
		</ToastsContext.Provider>
	)
}

export const useToast = () => {
	const {addToast} = React.useContext(ToastsContext);
	return {
		addToast,
		addErrorToast: (toast: LightToast) => addToast({...toast, type: "error"}),
		addSuccessToast: (toast: LightToast) => addToast({...toast, type: "success"}),
		addInfoToast: (toast: LightToast) => addToast({...toast, type: "info"}),
	};
}

interface LightToast {
	title: string;
	message: string;
}

export interface NewToast extends LightToast {
	type: "error" | "success" | "info";
}

interface Toast extends NewToast {
	id: number
	timer: NodeJS.Timeout;
}

const Toast: React.FC<Toast> = ({title, message, type, id, timer}) => {
	const {removeToast} = React.useContext(ToastsContext);
	const color = type === "error" ? "bg-red-950" : type === "success" ? "bg-green-950" : "bg-sky-950";
	const border = type === "error" ? "border-red-800" : type === "success" ? "border-green-800" : "border-sky-800";
	const shadow = type === "error" ? "shadow-red-800" : type === "success" ? "shadow-green-800" : "shadow-sky-800";
	const [opacity, setOpacity] = useState('opacity-0');

	useEffect(() => {
		setOpacity('opacity-100');
	}, [])

	const clear = () => {
		clearTimeout(timer);
	}

	const titleColor = type === "error" ? "bg-red-900" : type === "success" ? "bg-green-900" : "bg-sky-900";


	return (
		<div className={`${color} border-2 ${border} shadow-md ${shadow} rounded-md px-2 py-2 min-w-96 ${opacity} transition-opacity`} onMouseEnter={clear}>
			<div className={`relative ${titleColor} -mt-2 -mx-2 px-4 p-2 flex items-center overflow-hidden`}>
				{title}
				<div className="absolute right-0 p-2 box-border cursor-pointer hover:bg-white hover:bg-opacity-25 transition-colors" onClick={() => removeToast(id)}>
					<CloseIcon width={20} height={20} />
				</div>
			</div>
			<pre className="max-w-2xl overflow-x-auto">
				{message}
			</pre>
		</div>
	)
}