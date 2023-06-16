"use client";
import { useAccount, Address } from "wagmi";
import { useCreateRegistry } from "@/tools/hooks/useRegistry";
import {useRouter} from 'next/navigation';
import { useToast } from "@/components/Toast";
import { FormEventHandler, useEffect } from "react";

type CreateRegistryProps = {
  factoryAddress: Address
}

export default function CreateRegsitry({factoryAddress}: CreateRegistryProps) {
	const { address } = useAccount();
  const {data, status, write, writeAsync} = useCreateRegistry({
    address: factoryAddress,
  })
  const {push} = useRouter();
  const {addErrorToast, addSuccessToast} = useToast();

  useEffect(() => {
    console.log(data);
  }, [data])

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
		if (!address) throw new Error("Wallet not connected")
    writeAsync({ args: [name, [address], BigInt(1), BigInt(Math.floor(Math.random()*1000000))] })
      .then(res => {
        addSuccessToast({title: "Created Registry", message: `Registry created at ${res.hash}`})
        push('/');
      })
      .catch(err => addErrorToast({title: "Error", message: err.message}))
	}

	return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="relative p-2 rounded-lg shadow-lg bg-slate-700">
          <div>Get started by creating an Orginaization</div>
          <div className="">
            <form onSubmit={handleSubmit}>
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