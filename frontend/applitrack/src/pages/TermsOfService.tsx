import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm">
                By creating an account and using ApplyTrack, you agree to these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
              <div className="text-sm space-y-2">
                <p>ApplyTrack is a personal job application tracking tool that helps you:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Track and organize your job applications</li>
                  <li>Manage interview rounds and follow-ups</li>
                  <li>Set reminders for important dates</li>
                  <li>Analyze your job search performance</li>
                  <li>Import and export your application data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
              <div className="text-sm space-y-2">
                <h3 className="font-medium">Account Creation:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>You must provide a valid email address</li>
                  <li>You must create a secure password (minimum 8 characters)</li>
                  <li>One account per person</li>
                  <li>You must be at least 16 years old</li>
                </ul>

                <h3 className="font-medium mt-3">Account Security:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>You are responsible for maintaining account security</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Do not share your account credentials</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use</h2>
              <div className="text-sm space-y-2">
                <h3 className="font-medium">You may:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use ApplyTrack for personal job search tracking</li>
                  <li>Export your own data</li>
                  <li>Provide feedback and suggestions</li>
                </ul>

                <h3 className="font-medium mt-3">You may not:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use the service for illegal activities</li>
                  <li>Attempt to access other users' data</li>
                  <li>Reverse engineer or copy the software</li>
                  <li>Use automated scripts to create accounts</li>
                  <li>Share false or misleading information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Ownership</h2>
              <div className="text-sm space-y-2">
                <p><strong>Your Content:</strong> You retain ownership of all data you input into ApplyTrack.</p>
                <p><strong>Service Data:</strong> We own the software, infrastructure, and service improvements.</p>
                <p><strong>Data Export:</strong> You can export your data anytime in JSON format.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Service Availability</h2>
              <div className="text-sm space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>We strive for 99% uptime but cannot guarantee uninterrupted service</li>
                  <li>Planned maintenance will be announced in advance when possible</li>
                  <li>We are not liable for temporary service interruptions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Data Backup and Security</h2>
              <div className="text-sm space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>We perform regular automated backups</li>
                  <li>All data is encrypted in transit and at rest</li>
                  <li>We implement industry-standard security measures</li>
                  <li>You are encouraged to export your data regularly</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Account Termination</h2>
              <div className="text-sm space-y-2">
                <h3 className="font-medium">By You:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>You may delete your account at any time</li>
                  <li>All your data will be permanently deleted</li>
                  <li>Export your data before deletion if needed</li>
                </ul>

                <h3 className="font-medium mt-3">By Us:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>We may terminate accounts for terms violations</li>
                  <li>30 days notice will be provided when possible</li>
                  <li>Data export will be available during notice period</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
              <p className="text-sm">
                ApplyTrack is provided "as is" without warranties. We are not liable for any 
                direct, indirect, or consequential damages arising from use of the service. 
                Your maximum recourse is discontinuing use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
              <div className="text-sm space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>We may update these terms with 30 days notice</li>
                  <li>Continued use constitutes acceptance of new terms</li>
                  <li>Major changes will require explicit consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
              <p className="text-sm">
                These terms are governed by French law and EU regulations including GDPR. 
                Any disputes will be resolved in French courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
              <div className="text-sm space-y-2">
                <p>For questions about these terms:</p>
                <p className="font-medium">Email: legal@applytrack.app</p>
                <p className="text-xs text-muted-foreground">
                  We will respond to all inquiries within 5 business days.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}