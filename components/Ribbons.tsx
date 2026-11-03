import { CookieIcon } from "./Icons";

const WORDS_A = ["SmaG", "Pecheniya", "Har kuni yangi", "SmaG", "Pecheniya", "Mazali lahzalar"];
const WORDS_B = ["Kunjut", "Shokolad", "Lochira", "Yubileynoe", "Sasha-Masha", "Essen"];

function Track({ words, iconColor }: { words: string[]; iconColor: string }) {
  // content is rendered twice so the -50% marquee loop is seamless
  const half = (
    <span>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 28 }}>
          {w}
          <CookieIcon size={26} color={iconColor} />
        </span>
      ))}
    </span>
  );
  return (
    <div className="ribbon-track">
      {half}
      <span aria-hidden="true">{half}</span>
    </div>
  );
}

export function Ribbons() {
  return (
    <div className="ribbons" aria-hidden="true">
      <div className="ribbon ribbon-a">
        <Track words={WORDS_A} iconColor="#5b2a14" />
      </div>
      <div className="ribbon ribbon-b">
        <Track words={WORDS_B} iconColor="#ffc72c" />
      </div>
    </div>
  );
}
