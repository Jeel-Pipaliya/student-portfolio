function Header({ name, themeColor }) {
  return (
    <header className="header" style={themeColor ? { backgroundColor: themeColor } : undefined}>
      <h1>{name}</h1>
      <p>Student Portfolio</p>
    </header>
  );
}

export default Header;