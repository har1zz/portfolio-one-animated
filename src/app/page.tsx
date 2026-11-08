import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Rail } from "@/components/Rail";
import { Reveals } from "@/components/Reveals";
import { Services } from "@/components/Services";
import { Story } from "@/components/Story";
import { Strip } from "@/components/Strip";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Rail />
      <Hero />
      <Strip />
      <Story />
      <Work />
      <Services />
      <About />
      <Contact />
      <Reveals />
    </>
  );
}
