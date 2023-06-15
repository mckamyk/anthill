import { getFactoryAddress } from "@/contracts/Factory";
import CreateRegsitry from "./createRegistry";

export default async function Create() {
	const factoryAddress = await getFactoryAddress();
	return <CreateRegsitry factoryAddress={factoryAddress} />
}
