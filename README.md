# CFA Ensemble Learning Programme Dashboard

A premium, modern web dashboard for managing syllabus objectives, lesson plans, rehearsal logs, and feedback across university music ensembles (NUS Symphony Orchestra - NUSSO & NUS Wind Symphony - NUSWS). 

This app prototype demonstrates a role-based access model specifically built for:
1. **Coordinators**: Manage the high-level syllabus, log tutti feedback, and monitor progress across all ensembles.
2. **Section Tutors**: Create lesson plans and log session progress for their specific section (e.g., NUSSO Flute Tutor, NUSWS Trombone Tutor).

---

## Key Features

- **Dynamic Role-Based Views**: Instant simulation of different users (Coordinators or individual Tutors) using the role switcher at the top.
- **Strict Data Privacy**: 
  - Tutors can *only* see and manage plans and logs for their assigned section.
  - Tutors *only* see tutti feedback related to their section.
  - Coordinators have bird's-eye access to view, update, and feedback on all sections.
- **Curriculum Synchronization**: Coordinators define syllabus priorities, which instantly update the target section's dashboard for active alignment.
- **Robust Local Storage**: All entries, logs, syllabus changes, and feedbacks persist across browser sessions.
- **Curated High-End Design**: 
  - Tailored color styling (deep slate, emerald accents, orange warning badges).
  - Modern typography and clean spacing.
  - Smooth micro-interactions and animations.
  - Responsive layout for desktop, tablet, and mobile views.

---

## File Structure

- `index.html`: Layout structure, forms, and section containers.
- `style.css`: Clean Vanilla CSS using modern custom variables, styling, and grid displays.
- `app.js`: Local storage data-store manager, role switching mechanism, authentication gates, and dynamic rendering.

---

## Getting Started

1. Open `index.html` in any web browser.
2. Use the **Role Selector** bar at the top of the screen to simulate logging in as different users.
3. Add syllabus objectives as a Coordinator, switch to a Tutor to see their lesson plan fields update, and watch the privacy gates in action!
