import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
const manrope=Manrope({variable:"--font-manrope",subsets:["latin"]});
export const metadata:Metadata={title:"Rumbo · Mi roster",description:"Calendario de tripulaciones claro, local y siempre disponible.",manifest:"./manifest.webmanifest",icons:{icon:"./icon.svg",apple:"./icon.svg"}};
export const viewport:Viewport={themeColor:"#f7f5ef",width:"device-width",initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body className={manrope.variable}>{children}</body></html>}
