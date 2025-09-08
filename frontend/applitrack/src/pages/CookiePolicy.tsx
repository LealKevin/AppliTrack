import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/register">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Cookie Policy</CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. What Are Cookies?</h2>
              <p className="text-sm">
                Cookies are small text files stored on your device when you visit a website. 
                They help websites remember your preferences and provide core functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Cookies We Use</h2>
              <div className="space-y-4">
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-700 mb-2">✅ Essential Cookies (Required)</h3>
                  <p className="text-sm mb-3">These cookies are necessary for ApplyTrack to function properly.</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-gray-50 rounded">
                      <div><strong>Cookie Name:</strong> jwt</div>
                      <div><strong>Purpose:</strong> Authentication</div>
                      <div><strong>Duration:</strong> 24 hours</div>
                    </div>
                    <p className="text-xs">
                      Keeps you logged in securely. HttpOnly and Secure flags protect against XSS attacks.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-gray-50 rounded">
                      <div><strong>Cookie Name:</strong> _csrf</div>
                      <div><strong>Purpose:</strong> Security</div>
                      <div><strong>Duration:</strong> Session</div>
                    </div>
                    <p className="text-xs">
                      Protects against Cross-Site Request Forgery attacks.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-gray-50 rounded">
                      <div><strong>Cookie Name:</strong> theme</div>
                      <div><strong>Purpose:</strong> UI Preferences</div>
                      <div><strong>Duration:</strong> 1 year</div>
                    </div>
                    <p className="text-xs">
                      Remembers your dark/light mode preference.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">❌ Cookies We Don't Use</h3>
                  <div className="text-sm space-y-2">
                    <p>ApplyTrack does <strong>NOT</strong> use:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Analytics cookies</strong> (no Google Analytics, no tracking)</li>
                      <li><strong>Advertising cookies</strong> (no ads, no retargeting)</li>
                      <li><strong>Social media cookies</strong> (no Facebook pixels, no social tracking)</li>
                      <li><strong>Third-party cookies</strong> (no external services with cookies)</li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Legal Basis</h2>
              <div className="text-sm space-y-2">
                <p>Our use of essential cookies is based on:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Legitimate Interest:</strong> Providing secure authentication and core functionality</li>
                  <li><strong>Technical Necessity:</strong> Cookies required for the service to work</li>
                  <li><strong>Security Requirements:</strong> CSRF protection mandated by security standards</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Under GDPR Article 6(1)(f), essential cookies do not require explicit consent.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Cookie Management</h2>
              <div className="text-sm space-y-3">
                
                <div>
                  <h4 className="font-medium">Browser Settings:</h4>
                  <p className="mb-2">You can control cookies through your browser settings:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">⚠️ Important Note</p>
                  <p className="text-xs text-yellow-700">
                    Blocking essential cookies will prevent ApplyTrack from functioning properly. 
                    You will not be able to log in or use the application.
                  </p>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. No Cookie Banner Required</h2>
              <div className="text-sm space-y-2">
                <p>
                  Since ApplyTrack only uses essential cookies for core functionality, 
                  no cookie consent banner is legally required under GDPR.
                </p>
                <p className="text-xs text-muted-foreground">
                  Reference: GDPR Article 7 exempts technically necessary cookies from consent requirements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
              <div className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>JWT token:</strong> Expires after 24 hours automatically</li>
                  <li><strong>CSRF token:</strong> Cleared when browser session ends</li>
                  <li><strong>Theme preference:</strong> Stored for 1 year, can be reset anytime</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. International Transfers</h2>
              <p className="text-sm">
                All cookies are stored locally on your device or on our EU-based servers. 
                No cookie data is transferred to third countries outside the EU.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Updates to This Policy</h2>
              <div className="text-sm space-y-2">
                <p>
                  If we add new types of cookies, we will update this policy and notify users. 
                  The "Last updated" date at the top shows when changes were made.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
              <div className="text-sm space-y-2">
                <p>Questions about our cookie usage?</p>
                <p className="font-medium">Email: privacy@applytrack.app</p>
                <p className="text-xs text-muted-foreground">
                  We will respond within 30 days as required by GDPR.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}