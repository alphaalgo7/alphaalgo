"use client"

import { Button } from "@/components/ui/button"
import { customToast } from "./custom-toast"

export function ToastTest() {
  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <Button
        onClick={() =>
          customToast({
            title: "Success",
            description: "Operation completed successfully",
            variant: "default",
          })
        }
        variant="outline"
        className="bg-green-50"
      >
        Test Success Toast
      </Button>
      <Button
        onClick={() =>
          customToast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          })
        }
        variant="outline"
        className="bg-red-50"
      >
        Test Error Toast
      </Button>
    </div>
  )
}
