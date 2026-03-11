export default function Footer2() {
  return (
    <footer className="w-full bg-background-light dark:bg-background-dark mt-auto">
      <div className="border-t border-gray-300 dark:border-border-dark py-6">
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Lumina Candles Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
