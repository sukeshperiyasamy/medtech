type Props = React.HTMLAttributes<HTMLElement> & {
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Fade + short rise when the element first enters the viewport.
 * Server-rendered markup only: the animation is run by the small inline script in
 * lib/reveal-script, which starts before React hydrates — so content already on screen
 * paints straight away instead of waiting for the JavaScript bundle.
 */
export function Reveal({ delay = 0, y = 18, as: Comp = "div", style, children, ...rest }: Props) {
  return (
    <Comp
      data-reveal=""
      style={{ ["--reveal-delay" as string]: `${delay}s`, ["--reveal-y" as string]: `${y}px`, ...style }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
