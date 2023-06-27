"use client"

import { MouseEventHandler} from "react";

interface ButtonProps {
	children: React.ReactNode;
	onClick: MouseEventHandler<HTMLButtonElement>;
}

const Button = ({children, onClick}: ButtonProps) => {
	return (
		<button className="px-2 py-1 bg-sky-600" onClick={onClick}>
			{children}
		</button>
	)
}

export default Button