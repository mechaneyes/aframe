import Link from "next/link";

const Nav = (props) => {
  let page = props.page;
  let pageTitle = "Third Eyes";

  if (page == "stability") {
    pageTitle = "Third Eyes v Stability AI";
  }

  if (page == "chat") {
    pageTitle = "Third Chat";
  }

  if (page == "about") {
    pageTitle = "About Third Eyes";
  }

  return (
    <section className="header">
      <h1 className="header__title">{pageTitle}</h1>
      <nav className="nav">
        <ul>
          <li
            className={`nav__item nav__item--home ${
              page == "home" ? "nav__item--active" : ""
            }`}
          >
            <Link href="/">Home</Link>
          </li>{" "}
          &middot;{" "}
          <li
            className={`nav__item nav__item--stability ${
              page == "stability" ? "nav__item--active" : ""
            }`}
          >
            <Link href="/stability">Stability</Link>
          </li>{" "}
          &middot;{" "}
          <li
            className={`nav__item nav__item--chat ${
              page == "chat" ? "nav__item--active" : ""
            }`}
          >
            <Link href="/chat">Chat</Link>
          </li>{" "}
          &middot;{" "}
          <li
            className={`nav__item nav__item--about ${
              page == "about" ? "nav__item--active" : ""
            }`}
          >
            <Link href="/about">About</Link>
          </li>{" "}
          <span
            className={`nav__item nav__item--middot ${
              page == "home" ? "nav__item--hidden" : ""
            }`}
          >
            &middot;
          </span>
          <li
            className={`nav__item nav__item--email ${
              page == "home" ? "nav__item--hidden" : ""
            }`}
          >
            <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default Nav;
