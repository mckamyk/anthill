import { defineConfig } from "@wagmi/cli";
import { foundry, react, actions } from '@wagmi/cli/plugins'

export default defineConfig({
	out: "src/generated.ts",
	plugins: [
		foundry({
			project: "../anthill-contracts"
		}),
		react(),
		actions()
	],
});