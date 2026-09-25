import type { GalleryImage } from "@/lib/types";

// ICMI 2025 photographs supplied by the department (Sep 2026), colour-graded for the
// site. Captions describe what is visible only — no names or venues are asserted.
const icmi = (
  n: string,
  slug: string,
  caption: string,
  alt: string,
  portrait = false,
): GalleryImage => ({
  id: `icmi-2025-${n}`,
  eventId: "icmi-2025",
  src: `/images/icmi-2025/icmi-2025-${n}-${slug}.jpg`,
  width: portrait ? 1500 : 2000,
  height: portrait ? 2000 : 1500,
  caption,
  alt,
});

export const gallery: GalleryImage[] = [
  icmi("01", "banner", "ICMI 2025 conference banner", "Indian Conference on MedTech Innovations banner beside a fountain, framed by trees"),
  icmi("02", "inauguration", "Inauguration", "Dignitaries on stage beside a floral arrangement during the conference inauguration"),
  icmi("03", "lamp-lighting", "Ceremonial lamp lighting", "Guests lighting the ceremonial lamp at the opening of the conference"),
  icmi("04", "auditorium", "Main auditorium", "Wide view of the auditorium stage with the ICMI title on the screen and panel seated"),
  icmi("05", "audience", "In the auditorium", "Delegates seated across the raked auditorium"),
  icmi("06", "talk", "Invited talk", "Speaker at the podium presenting on medical AI in front of a large screen"),
  icmi("07", "virtual-keynote", "Talk on the main screen", "Audience in the auditorium watching a speaker shown on the big screen"),
  icmi("08", "poster-session", "Poster session", "Students discussing research posters with a delegate during the poster session"),
  icmi("09", "exhibition-demo", "Exhibition demonstration", "Young visitors trying a touchscreen demonstration at an exhibition stall"),
  icmi("10", "exhibition-hall", "Exhibition hall", "Overhead view of visitors moving between exhibition booths in a long hall", true),
  icmi("11", "session-audience", "Session audience", "Delegates seated in a lecture hall during a session"),
  icmi("12", "session", "Session presentation", "Presenter at a lectern addressing a seated audience in a lecture hall"),
  icmi("13", "group-photo", "Delegates and participants", "Large group photograph of conference delegates and participants on building steps"),
  icmi("14", "team", "Participants", "A group of conference participants standing together in formal attire"),
];

/** The Centre's building entrance (supplied by the department, Sep 2026). */
export const centreBuilding: GalleryImage = {
  id: "centre-building",
  eventId: "centre",
  src: "/images/centre/medtech-centre-w16-berm.jpg",
  width: 1448,
  height: 1086,
  caption: "Medical Technology Centre, W16 Berm, IIT Jodhpur",
  alt: "Entrance of the Medical Technology Centre building at IIT Jodhpur: sandstone façade, signage above double doors, and a 'W16 Berm' location board",
};
