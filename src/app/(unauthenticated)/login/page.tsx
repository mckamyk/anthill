import SuperLoginButton from "./superButton";

export default function Login() {
	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<div className="bg-slate-800 p-4 rounded-lg w-[600px]">
				<h3 className="text-lg text-center font-extrabold">Welcome to Anthill</h3>
				<div className="flex justify-center">
					<SuperLoginButton />
				</div>
			</div>
		</div>
	)
}