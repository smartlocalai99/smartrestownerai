import { Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

export const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["600", "700", "900"],
  style: ["normal"],
  display: "swap",
});

export const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});
