import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="page not-found">
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        Sorry, the page you are looking for does not exist.
      </p>

      <Link to="/">
        Go Back Home
      </Link>
    </section>
  );
}

export default NotFound;