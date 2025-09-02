import Header from "@/shared/components/header";
import Footer from "@/shared/components/Footer";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<div className=" flex-1 mb-auto max-w-4xl mx-auto p-4 w-9/10">
				{children}
			</div>

			<Footer />
		</div>
	);
}
