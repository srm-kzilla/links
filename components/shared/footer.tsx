export default function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 py-2 text-center text-xs md:text-sm">
      <p className="py-2 mx-3 md:mx-6 text-darkgray font-bold">
        Made with {" "}
        <span role="img" aria-label="emoji" className="mx-2 animate-pulse">
          ❤️
        </span>
        by your friends at
        <a
          className="font-extrabold"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.srmkzilla.net/"
        >
          {" "}
          SRMKZILLA
        </a>
      </p>
    </footer>
  );
}
