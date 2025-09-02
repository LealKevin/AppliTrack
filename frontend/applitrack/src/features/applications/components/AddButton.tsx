import { Button } from "@/shared/components/ui/button";

const iconPlus = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-6"
	>
		<path
			fillRule="evenodd"
			d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
			clipRule="evenodd"
		/>
	</svg>
);

type AddButtonProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function AddButton({ onClick }: AddButtonProps) {
	return (
		<Button
			onClick={onClick}
			className="px-6 py-3 rounded-[15px] border-none transition-all duration-300 hover:translate-y-[-1px] flex items-center justify-center gap-2 font-medium text-sm min-w-[160px]"
			style={{
				background: 'var(--primary)',
				boxShadow: 'var(--app-button-shadow)',
				color: 'var(--primary-foreground)'
			}}
		>
			{iconPlus}
			Add Application
		</Button>
	);
}

export default AddButton;
