import NoteList from "../../note/NoteList";

const HomePage = ({ token }) => {
  return (
    // <DefaultPage title="Home"></DefaultPage>
    <div className="home">
      <h2 id="headline">Apple Note</h2>
      <NoteList token={token} />
    </div>
  );
};

export default HomePage;
