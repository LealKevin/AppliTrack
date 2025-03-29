import { UserConnectionModal } from "@/components/UserConnectionModal";
import { createContext, useContext, useState } from "react";

type UserConnectionContextType = {
	openModal: () => void;
	closeModal: () => void;
};

const UserConnectionContext = createContext<
	UserConnectionContextType | undefined
>(undefined);

type UserConnectionModalProviderProps = {
	children: React.ReactNode;
};

export const UserConnectionModalProvider = ({
	children,
}: UserConnectionModalProviderProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<UserConnectionContext.Provider value={{ openModal, closeModal }}>
			{children}
			<UserConnectionModal isModalOpen={isOpen} handleClose={closeModal} />
		</UserConnectionContext.Provider>
	);
};

export const useUserConnectionModal = () => {
	const context = useContext(UserConnectionContext);
	if (!context) {
		throw new Error("Unable to find userConnectionContect");
	}
	return context;
};
