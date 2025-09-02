import * as React from "react";
import { IconCheck, IconX, IconFileText, IconAlertCircle, IconInfoCircle, IconUpload, IconFileImport } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import type { ImportResult } from "@/shared/utils/apiCalls";
import { cn } from "@/shared/lib/utils";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
  isImporting?: boolean;
  result?: ImportResult | null;
}

function ImportModal({ isOpen, onClose, onImport, isImporting = false, result }: ImportModalProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [dragCounter, setDragCounter] = React.useState(0);
  const [showFormatRequirements, setShowFormatRequirements] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      onImport(csvFile);
    } else {
      alert('Please drop a valid CSV file.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please select a valid CSV file.');
        return;
      }
      onImport(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const hasErrors = result && result.failure_count > 0;
  const hasSuccess = result && result.success_count > 0;
  const showResults = result !== undefined && result !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <IconFileImport className="h-5 w-5" />
            {showResults ? 'CSV Import Results' : 'Import Applications from CSV'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showResults && (
            <>
              {/* File Upload Section */}
              <div className="space-y-4">
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                    isDragOver 
                      ? "border-primary bg-primary/10" 
                      : "border-muted-foreground/25 hover:border-muted-foreground/50",
                    isImporting && "opacity-50 pointer-events-none"
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                      "rounded-xl p-4 transition-colors",
                      isDragOver ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <IconUpload className="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-lg font-medium">
                        {isDragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        or click the button below to browse files
                      </div>
                    </div>

                    <Button 
                      onClick={handleButtonClick}
                      disabled={isImporting}
                      className="mt-2 rounded-xl"
                      variant="ghost"
                    >
                      {isImporting ? (
                        <>
                          <IconFileText className="mr-2 h-4 w-4 animate-pulse" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <IconFileText className="mr-2 h-4 w-4" />
                          Select CSV File
                        </>
                      )}
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {showResults && (
            <>
              {/* Results Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold text-muted-foreground">{result.total_records}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600 dark:text-green-400">
                    <IconCheck className="h-5 w-5" />
                    {result.success_count}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Successful</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-red-600 dark:text-red-400">
                    <IconX className="h-5 w-5" />
                    {result.failure_count}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
                </div>
              </div>

              {/* Success Message */}
              {hasSuccess && !hasErrors && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
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
                <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
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
                    <div className="max-h-40 w-full rounded-xl border bg-muted/30 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
                      <div className="p-3 space-y-2">
                        {result.failures.map((error, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-muted-foreground min-w-[20px] flex-shrink-0">{index + 1}.</span>
                            <span className="text-red-600 dark:text-red-400 break-words">{error}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {result.failures.length > 5 && (
                      <div className="text-xs text-muted-foreground mt-1 text-center">
                        Scroll to see all {result.failures.length} errors
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />
            </>
          )}

          {/* CSV Format Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconInfoCircle className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium">CSV Format Requirements</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFormatRequirements(!showFormatRequirements)}
                className="text-sm"
              >
                {showFormatRequirements ? 'Hide' : 'Show'} Requirements
              </Button>
            </div>
            
            {showFormatRequirements && (
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 overflow-hidden">
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">Required Columns (in order):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-blue-700 dark:text-blue-300">
                      <div>1. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded-lg">Title</span></div>
                      <div>2. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded-lg">Company</span></div>
                      <div>3. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded-lg">Date (YYYY-MM-DD)</span></div>
                      <div>4. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded-lg">Location</span></div>
                      <div>5. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded-lg">Status</span></div>
                      <div>6. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded-lg">Notes</span></div>
                      <div className="sm:col-span-2">7. <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-1 rounded-lg">Application URL</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">Example:</div>
                    <div className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl border overflow-x-auto">
                      "Software Engineer","Tech Corp","2024-01-15","New York","interview_scheduled","Great opportunity","https://example.com"
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">Valid Status Values:</div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">pending</Badge>
                      <Badge variant="outline" className="text-xs">sent</Badge>
                      <Badge variant="outline" className="text-xs">interview_scheduled</Badge>
                      <Badge variant="outline" className="text-xs">interviewing</Badge>
                      <Badge variant="outline" className="text-xs">rejected</Badge>
                      <Badge variant="outline" className="text-xs">offer</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {showResults && (
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mr-auto"
              >
                Import Another File
              </Button>
            )}
            <Button 
              onClick={onClose}
              variant={showResults ? "default" : "outline"}
            >
              {showResults ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImportModal;