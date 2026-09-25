import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";

interface Props {
  index?: string;
  src: string;
  poster: string;
  duration: string;
}

/**
 * "Inside the Centre" — a portrait walkthrough film beside an editorial description.
 * The video only downloads when played (preload="none"), never autoplays with sound,
 * and plays inline on phones.
 */
export function CentreVideo({ index, src, poster, duration }: Props) {
  return (
    <section aria-labelledby="centre-video-title" className="section-y border-t border-line">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5 lg:col-start-2">
          <figure className="mx-auto max-w-[22rem] lg:max-w-none">
            <div className="overflow-hidden bg-ink">
              <video
                className="aspect-[9/16] w-full object-cover"
                src={src}
                poster={poster}
                controls
                playsInline
                preload="none"
                aria-describedby="centre-video-desc"
              >
                <a href={src}>Download the walkthrough video (MP4)</a>
              </video>
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4">
              <span className="text-sm text-muted">A walk through the Medical Technology Centre</span>
              <span className="font-mono text-xs text-muted">{duration}</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow mb-5 flex items-center gap-3">
            {index && <span className="text-blue">{index}</span>}
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span>Inside the Centre</span>
          </p>
          <h2 id="centre-video-title" className="text-h2 text-ink">
            Where the work happens.
          </h2>
          <p id="centre-video-desc" className="text-lead mt-6 text-ink-2">
            A short walk through the Medical Technology Centre building at W16 Berm — from the
            entrance, past a working session in the meeting room, into the hall where students present
            their research posters.
          </p>
          <ul className="mt-8 border-t border-line text-[0.95rem]">
            {["The entrance at W16 Berm", "Meeting and discussion room", "Research poster presentations"].map((t, i) => (
              <li key={t} className="flex gap-4 border-b border-line py-3">
                <span className="font-mono text-xs text-blue">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink">{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">The video has sound. Press play to start.</p>
          <MoreLink href="/gallery" className="mt-8">
            Explore the Gallery
          </MoreLink>
        </Reveal>
      </div>
    </section>
  );
}
