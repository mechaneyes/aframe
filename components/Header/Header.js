import Link from "next/link";

const Nav = (props) => {
  let page = props.page;
  console.log("page", page);

  let pageTitle = "Third Eyes";

  if (page == "stability") {
    pageTitle = "Third Eyes v Stability AI";
  }

  if (page == "about") {
    pageTitle = "About Third Eyes";
  }

  return (
    <div className="header">
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
            className={`nav__item nav__item--about ${
              page == "about" ? "nav__item--active" : ""
            }`}
          >
            <Link href="/about">About</Link>
          </li>{" "}
          <li
            className={`nav__item nav__item--email ${
              page == "home" ? "nav__item--hidden" : ""
            }`}
          >
            &middot; <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
