"use client"

import { useState } from "react"
import { IconTrash, IconSettings, IconDownload, IconShield } from "@tabler/icons-react"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import type { UserType } from "@/shared/utils/apiCalls"
import useDeleteUser from "@/shared/hooks/useDeleteUser"

type UserProfileSheetProps = {
  user: UserType | null
  children: React.ReactNode
}

export function UserProfileSheet({ user, children }: UserProfileSheetProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const deleteUserMutation = useDeleteUser()

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    try {
      await deleteUserMutation.mutateAsync()
    } catch (error) {
      console.error("Failed to delete account:", error)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <IconSettings className="size-5" />
            Profile Settings
          </SheetTitle>
          <SheetDescription>
            Manage your account settings and preferences.
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          {/* User Info Section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">Account Information</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="font-medium">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* GDPR & Privacy Section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <IconShield className="size-4" />
              Privacy & Data
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Export Your Data</h4>
                    <p className="text-xs text-muted-foreground">
                      Download all your personal data in JSON format (GDPR compliance)
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Export user data via API call
                      fetch("/api/user/export", {
                        method: "GET",
                        credentials: "include"
                      })
                      .then(response => {
                        if (response.ok) {
                          return response.blob();
                        }
                        throw new Error("Export failed");
                      })
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "applytrack_data_export.json";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      })
                      .catch(error => {
                        console.error("Data export failed:", error);
                      });
                    }}
                  >
                    <IconDownload className="size-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Your privacy rights:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Right to access your data (export above)</li>
                  <li>Right to rectify data (edit in app)</li>
                  <li>Right to erase data (delete account below)</li>
                  <li>Right to data portability (export above)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="grid gap-3">
                <div>
                  <h4 className="text-sm font-medium">Delete Account</h4>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. This will permanently delete your account and all associated data.
                  </p>
                </div>
                
                {showDeleteConfirm && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded">
                    <p className="text-sm font-medium text-destructive mb-2">
                      Are you absolutely sure?
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      This will permanently delete your account and all your job applications. This action cannot be undone.
                    </p>
                  </div>
                )}
                
                <Button
                  variant={showDeleteConfirm ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={deleteUserMutation.isPending}
                  className="w-fit"
                >
                  <IconTrash className="size-4 mr-2" />
                  {deleteUserMutation.isPending ? "Deleting..." : showDeleteConfirm ? "Yes, delete my account" : "Delete Account"}
                </Button>
                
                {showDeleteConfirm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-fit"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}