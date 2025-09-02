import { IconCheck, IconX, IconFileText, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import type { ImportResult } from "@/shared/utils/apiCalls";

interface ImportResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ImportResult | null;
}

function ImportResultsModal({ isOpen, onClose, result }: ImportResultsModalProps) {
  if (!result) return null;

  const hasErrors = result.failure_count > 0;
  const hasSuccess = result.success_count > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconFileText className="h-5 w-5" />
            CSV Import Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-muted-foreground">{result.total_records}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600 dark:text-green-400">
                <IconCheck className="h-5 w-5" />
                {result.success_count}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Successful</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-red-600 dark:text-red-400">
                <IconX className="h-5 w-5" />
                {result.failure_count}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
            </div>
          </div>

          {/* Success Message */}
          {hasSuccess && !hasErrors && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <IconCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <div className="font-medium text-green-800 dark:text-green-200">
                  Import Completed Successfully!
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  All {result.success_count} records were imported without errors.
                </div>
              </div>
            </div>
          )}

          {/* Mixed Results */}
          {hasSuccess && hasErrors && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <IconAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="font-medium text-yellow-800 dark:text-yellow-200">
                  Import Partially Completed
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  {result.success_count} records imported successfully, {result.failure_count} failed.
                </div>
              </div>
            </div>
          )}

          {/* Error Details */}
          {hasErrors && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IconX className="h-4 w-4 text-red-500" />
                <h3 className="font-medium">Error Details</h3>
                <Badge variant="destructive" className="ml-auto">
                  {result.failure_count} errors
                </Badge>
              </div>
              
              <div className="relative">
                <div className="max-h-32 w-full rounded-lg border bg-muted/30 overflow-y-auto">
                  <div className="p-3 space-y-2">
                    {result.failures.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground min-w-[20px] flex-shrink-0">{index + 1}.</span>
                        <span className="text-red-600 dark:text-red-400 break-words">{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {result.failures.length > 3 && (
                  <div className="text-xs text-muted-foreground mt-1 text-center">
                    Scroll to see all {result.failures.length} errors
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* CSV Format Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium">CSV Format Requirements</h3>
            </div>
            
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4">
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">Required Columns (in order):</div>
                  <div className="grid grid-cols-2 gap-2 text-blue-700 dark:text-blue-300">
                    <div>1. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">Title</span></div>
                    <div>2. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">Company</span></div>
                    <div>3. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">Date (YYYY-MM-DD)</span></div>
                    <div>4. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">Location</span></div>
                    <div>5. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">Status</span></div>
                    <div>6. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">Notes</span></div>
                    <div className="col-span-2">7. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded">Application URL</span></div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">Example:</div>
                  <div className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-2 rounded border overflow-x-auto">
                    "Software Engineer","Tech Corp","2024-01-15","New York","pending","Great opportunity","https://example.com"
                  </div>
                </div>

                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">Valid Status Values:</div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">pending</Badge>
                    <Badge variant="outline" className="text-xs">sent</Badge>
                    <Badge variant="outline" className="text-xs">rejected</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImportResultsModal;