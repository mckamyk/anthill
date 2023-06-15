"use client";
import { useAccount } from "wagmi";
import { useCreateRegistry } from "@/tools/hooks/useRegistry";
import {useRouter} from 'next/navigation';
import { factoryAddress } from "@/contracts/Factory";
import { useToast } from "@/components/Toast";

export default function CreateRegsitry() {
	const { address } = useAccount();
  const {data, isLoading, isSuccess, isError, status, writeAsync} = useCreateRegistry({
    address: factoryAddress,
  })
  const router = useRouter();
  const {addErrorToast, addSuccessToast} = useToast();

	const handleSubmit = async (f: FormData) => {
		const name = f.get("name") as string;
		if (!address) throw new Error("Wallet not connected")
    try {
      const result = await writeAsync({ args: [name, [address], BigInt(1), BigInt(Math.floor(Math.random()*1000000))] })
      addSuccessToast({title: "Created Registry", message: `Registry created at ${result}`})
      router.push("/")
    } catch (e: any) {
      addErrorToast({title: "Failed to create registry", message: e.message})
      console.log(e);
    }
	}

	return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="relative p-2 rounded-lg shadow-lg bg-slate-700">
          <div>Get started by creating an Orginaization</div>
          <div className="">
            <form action={handleSubmit}>
              <div className="mb-2">
                <label className="text-sm pl-2">Name of Org</label>
                <input className="form-input bg-slate-800 block rounded-md w-full" name="name"></input>
              </div>

              <div className="flex justify-center">
                <button className="p-2 bg-sky-600 rounded-md active:bg-sky-800 transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
	)
}