import { toast } from "sonner";

export default function useToast() {
	return {
		success: (message: string) => toast.success(message),
		error: (message: string) => toast.error(message),
		loading: (message: string) => toast.loading(message),
		info: (message: string) => toast.info(message),
		warning: (message: string) => toast.warning(message),
		dismiss: (id?: string | number) => toast.dismiss(id),
	};
}