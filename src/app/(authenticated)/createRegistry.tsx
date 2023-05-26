"use client";
import { useAccount, useContractWrite } from "wagmi";
import { registryFactoryABI } from "../../generated";

export default function CreateRegsitry({factoryAddress}: {factoryAddress: `0x${string}`}) {
	const { address } = useAccount();
	const {data, isLoading, isSuccess, isError, write, status, writeAsync} = useContractWrite({
		address: factoryAddress,
		abi: registryFactoryABI,
		functionName: 'deployRegistry',
	});

	const handleSubmit = async (f: FormData) => {
		const name = f.get("name") as string;
		if (!address) throw new Error("Wallet not connected")
    try {
      const result = await writeAsync({ args: [name, [address], BigInt(1), BigInt(Math.floor(Math.random()*1000000))] })
    } catch (e) {
      console.log(e);
    }
	}

	return (
    <div className="flex h-full items-center justify-center">
      <div className="p-2 rounded-lg shadow-lg bg-slate-700">
        <div>Get started by creating an Orginaization</div>


        <div className="">
          <form action={handleSubmit}>
            <div className="mb-2">
              <label className="text-sm pl-2">Name of Org</label>
              <input className="form-input bg-slate-800 block rounded-md w-full" name="name"></input>
            </div>
            <div className="mb-2">
              <label className="text-sm pl-2">Description of Org</label>
              <input className="form-input bg-slate-800 block rounded-md w-full" name="desc"></input>
            </div>

            <div className="flex justify-center">
              <button className="p-2 bg-sky-600 rounded-md active:bg-sky-800 transition-colors">Create</button>
            </div>
          </form>
        </div>

        <div className="bg-slate-900 p-4">
          <pre>{JSON.stringify(status, undefined, 2)}</pre>
          <pre>data: {JSON.stringify(data, undefined, 2)}</pre>
          <pre>isLoading: {JSON.stringify(isLoading, undefined, 2)}</pre>
          <pre>isSuccess: {JSON.stringify(isSuccess, undefined, 2)}</pre>
          <pre>isError: {JSON.stringify(isError, undefined, 2)}</pre>
        </div>

      </div>
    </div>
	)
}