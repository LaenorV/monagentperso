"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const videos: [string, string][] = [
  ["Démo agent personnalisé", "Emplacement vidéo — vous pourrez remplacer cette zone par vos vraies preuves."],
  ["Avant / Après", "Montrez une capture avant agent puis le résultat obtenu après utilisation."],
  ["Workflow livré", "Présentez un exemple concret d'agent configuré pour un métier précis."],
  ["Utilisation sur ChatGPT", "Vidéo courte montrant comment le client lance son agent et obtient un résultat."],
  ["Résultat client", "Ajoutez ici un cas réel : temps gagné, livrable produit, tâche automatisée."],
];

export default function VideoCarousel() {
  const [v, setV] = useState(0);
  const prev = (v - 1 + videos.length) % videos.length;
  const next = (v + 1) % videos.length;

  return (
    <div className="video-stage">
      <button className="arrow-btn arrow-left" onClick={() => setV(prev)} aria-label="Précédent">
        <ChevronLeft size={22} strokeWidth={2.2} />
      </button>
      <div className="video-card side">
        <div className="video-content">
          <div className="play"><Play size={28} fill="currentColor" /></div>
          <h3>{videos[prev][0]}</h3>
        </div>
      </div>
      <div className="video-card">
        <div className="video-content">
          <div className="play"><Play size={32} fill="currentColor" /></div>
          <h3>{videos[v][0]}</h3>
          <p>{videos[v][1]}</p>
        </div>
      </div>
      <div className="video-card side">
        <div className="video-content">
          <div className="play"><Play size={28} fill="currentColor" /></div>
          <h3>{videos[next][0]}</h3>
        </div>
      </div>
      <button className="arrow-btn arrow-right" onClick={() => setV(next)} aria-label="Suivant">
        <ChevronRight size={22} strokeWidth={2.2} />
      </button>
    </div>
  );
}
