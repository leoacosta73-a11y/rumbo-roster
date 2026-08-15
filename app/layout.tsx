import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
const manrope=Manrope({variable:"--font-manrope",subsets:["latin"]});
export const metadata:Metadata={title:"CrewRoster · Tu programación de vuelo",description:"Calendario personal para tripulaciones aeronáuticas.",manifest:"./manifest.webmanifest",icons:{icon:"./icon.svg",apple:"./icon.svg"}};
export const viewport:Viewport={themeColor:"#06151e",width:"device-width",initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body className={manrope.variable}>{children}</body></html>}
