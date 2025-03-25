import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";

function Application({ children }: PropsWithChildren) {
	return (
		<Button
			variant="ghost"
			className=" flex  flex-row w-full border-b border-t border-gray-200 m-2 p-4"
		>
			{children}
		</Button>
	);
}

export default Application;
