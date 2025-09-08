import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Personal Information:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Email address:</strong> Used for account authentication and communication</li>
                  <li><strong>Password:</strong> Securely hashed using Argon2 encryption</li>
                  <li><strong>Account creation/update timestamps:</strong> For security and audit purposes</li>
                </ul>

                <h3 className="text-lg font-medium mt-4">Application Data:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Job applications:</strong> Company names, positions, locations, dates</li>
                  <li><strong>Personal notes:</strong> Your notes about applications and interviews</li>
                  <li><strong>Interview rounds:</strong> Interview dates, types, and feedback</li>
                  <li><strong>Reminders:</strong> Personal reminders and follow-up dates</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Legal Basis for Processing</h2>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Consent:</strong> Explicit consent provided during account creation</li>
                <li><strong>Legitimate Interest:</strong> Providing and improving our job tracking service</li>
                <li><strong>Contract Performance:</strong> Fulfilling our service agreement with you</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Provide job application tracking functionality</li>
                <li>Authenticate your account and maintain security</li>
                <li>Generate personal analytics and insights</li>
                <li>Send important service notifications (optional)</li>
                <li>Improve our service based on usage patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
              <div className="space-y-2 text-sm">
                <p>We implement industry-standard security measures:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Encryption:</strong> Passwords hashed with Argon2, HTTPS everywhere</li>
                  <li><strong>Authentication:</strong> JWT tokens with secure cookies</li>
                  <li><strong>Access Control:</strong> Rate limiting and CSRF protection</li>
                  <li><strong>Data Isolation:</strong> Your data is completely isolated from other users</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Active accounts:</strong> Data retained while your account is active</li>
                <li><strong>Deleted accounts:</strong> All data permanently deleted immediately</li>
                <li><strong>Security logs:</strong> Kept for 30 days for security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Your Rights Under GDPR</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Right of Access</h4>
                  <p>View all your personal data in your account dashboard</p>
                </div>
                <div>
                  <h4 className="font-medium">Right to Rectification</h4>
                  <p>Update and correct your information anytime</p>
                </div>
                <div>
                  <h4 className="font-medium">Right to Erasure</h4>
                  <p>Delete your account and all associated data</p>
                </div>
                <div>
                  <h4 className="font-medium">Right to Data Portability</h4>
                  <p>Export your data in JSON format</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Cookies</h2>
              <div className="space-y-2 text-sm">
                <p>We use essential cookies only:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Authentication cookie:</strong> Keeps you logged in (HttpOnly, Secure)</li>
                  <li><strong>CSRF token:</strong> Protects against cross-site attacks</li>
                  <li><strong>Theme preference:</strong> Remembers your dark/light mode choice</li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  No tracking or analytics cookies are used.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Third-Party Services</h2>
              <p className="text-sm">
                ApplyTrack is self-hosted and does not share your data with third-party services. 
                All data is stored on secure servers with regular backups.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
              <div className="text-sm space-y-2">
                <p>For any privacy-related questions or to exercise your rights:</p>
                <p className="font-medium">Email: privacy@applytrack.app</p>
                <p className="text-xs text-muted-foreground">
                  We will respond to all requests within 30 days as required by GDPR.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}