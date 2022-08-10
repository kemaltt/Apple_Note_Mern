import NoteList from "../../note/NoteList";

const HomePage = ({ token }) => {
  return (
    // <DefaultPage title="Home"></DefaultPage>

    <NoteList token={token} />
  );
};

export default HomePage;
