export default function Footer() {
    return (
        <footer className=" sticky w-full bg-muted text-muted-foreground py-4 text-center text-sm">
            © {new Date().getFullYear()} AppliTrack. All rights reserved.
        </footer>
    );
}
