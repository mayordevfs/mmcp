import Button from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">TransBridge</h1>
        <div className="flex gap-4">
          <Button variant="custom" className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors border border-white">
            <Link href={`/money_transfer/login`}>
            Login
          </Link>
          </Button>

          <Button variant="custom" className="bg-blue-600 text-white hover:bg-blue-400 px-4 py-2 rounded-md font-medium transition-colors">
            <Link href={`/money_transfer/register`}>
            Register
          </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;