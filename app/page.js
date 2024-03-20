import Image from "next/image";
import Link from 'next/link';
import { libre_caslon_display } from '@/app/ui/fonts';
import { libre_caslon_display_bold } from '@/app/ui/fonts';
import Navbar from "@/app/ui/Navbar";

export default function Home() {
  return (
    <div className="min-w-full">
     <Navbar url="Home"/>
    </div>
  );
}
