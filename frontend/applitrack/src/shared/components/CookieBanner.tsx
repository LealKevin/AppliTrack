import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookies-accepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto bg-background border-2">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-2">We use essential cookies</h3>
              <p className="text-xs text-muted-foreground">
                ApplyTrack uses only essential cookies required for authentication and security. 
                No tracking or analytics cookies are used. Learn more in our{" "}
                <Link to="/cookie-policy" className="text-blue-600 hover:text-blue-500 underline">
                  Cookie Policy
                </Link>
                {" "}or{" "}
                <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500 underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <Button onClick={acceptCookies} size="sm">
                Accept Essential Cookies
              </Button>
              <Button 
                onClick={acceptCookies} 
                variant="ghost" 
                size="sm"
                className="p-2"
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}