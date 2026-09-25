import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getPeople } from "@/lib/data";
import { isRemote } from "@/lib/utils";
import { PeopleDirectory } from "./PeopleDirectory";

export async function PeopleSection({ index, heading = true }: SectionProps = {}) {
  const [leaders, all] = await Promise.all([getPeople("Leadership"), getPeople()]);
  const head = leaders[0];
  const directory = all.filter((p) => p.category !== "Leadership");

  return (
    <section id="people" aria-labelledby={heading ? "people-title" : undefined} className="section-y bg-paper">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="people-title"
          index={index}
          label="People"
          title="An interdisciplinary faculty."
          intro="Engineers, scientists, designers and public-health researchers affiliated with the Center — with clinical faculty from AIIMS Jodhpur to be added."
        />
        )}

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
          {head && (
            <Reveal className="lg:col-span-4">
              <article aria-labelledby="head-name" className="lg:sticky lg:top-28">
                <p className="eyebrow mb-4">Leadership</p>
                <div className="grid grid-cols-[7rem_1fr] gap-5 lg:block">
                  {head.photo && (
                    <div className="overflow-hidden bg-mist lg:aspect-[4/5]">
                      <Image
                        src={head.photo.src}
                        unoptimized={isRemote(head.photo.src)}
                        alt={head.photo.alt}
                        width={480}
                        height={600}
                        sizes="(min-width: 1024px) 28vw, 7rem"
                        className="aspect-[4/5] size-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="lg:mt-6">
                    <h3 id="head-name" className="text-[1.6rem] font-medium leading-tight tracking-[-0.02em] text-ink">
                      {head.name}
                    </h3>
                    <p className="mt-1 text-muted">{head.designation}</p>
                    <p className="mt-4 text-[0.9rem] text-ink-2">{head.researchInterests.join(" · ")}</p>
                    <ul className="mt-5 space-y-1.5 text-[0.9rem]">
                      {head.email && (
                        <li>
                          <a href={`mailto:${head.email}`} className="inline-flex items-center gap-2 text-ink hover:text-blue">
                            <Mail aria-hidden className="size-4 text-muted" />
                            <span className="link-line break-all">{head.email}</span>
                          </a>
                        </li>
                      )}
                      {head.phone && (
                        <li>
                          <a href={`tel:+91${head.phone.replace(/\D/g, "").replace(/^0/, "")}`} className="inline-flex items-center gap-2 text-ink hover:text-blue">
                            <Phone aria-hidden className="size-4 text-muted" />
                            <span className="link-line">{head.phone}</span>
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          )}
          <div className="lg:col-span-8">
            <PeopleDirectory people={directory} />
          </div>
        </div>
      </div>
    </section>
  );
}
