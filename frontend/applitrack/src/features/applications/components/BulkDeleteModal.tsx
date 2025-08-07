import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Trash2, AlertTriangle } from "lucide-react"

interface BulkDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selectedCount: number
  isDeleting?: boolean
}

export default function BulkDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isDeleting = false,
}: BulkDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          onClose()
        }
      }}
    >
      <AlertDialogContent className="flex flex-col items-center max-w-md">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold">
            Delete Applications
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-2">
            <p className="text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedCount} application{selectedCount === 1 ? "" : "s"}
              </span>
              ?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. The selected applications will be permanently removed.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex w-full justify-center gap-3 pt-4">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {selectedCount}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}