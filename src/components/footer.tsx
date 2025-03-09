import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Ngyungne Logo"
              height={0}
              width={0}
              priority
              className="h-16 w-auto"
            />
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <span>Jorpati, Gokarneshwor 5, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span>+977 9818123174</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span>donation@ngyungne.org</span>
              </li>
            </ul>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Teachings",
                "Courses",
                "Events",
                "Donate",
                "Contact Us",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2  hover:tracking-wide transition-all duration-300 ease-in-out"
                >
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-[#FDBE33] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                "Blog",
                "FAQ",
                "Ambassadors",
                "Sponsors",
                "Practices",
                "Gallery",
                "Buddhist Calendar",
                "Practice Journal",
                "Volunteers",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 hover:tracking-wide transition-all duration-300 ease-in-out"
                >
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link
                    href={`/resources/${item.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-amber-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-gray-700" />
        <div className="text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Ngyungne Organization. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
