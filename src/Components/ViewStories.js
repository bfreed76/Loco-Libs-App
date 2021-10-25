import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ViewStories = (props) => {
  const [storyList, setStoryList] = useState(["empty"]);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();
  // const baseURL = "https://loco-libs-rails-backend.herokuapp.com/"  // Production API
  // const baseURL = "http://localhost:9393/" // SQLite3 Development API
  const baseURL = "http://localhost:3000/"; // PSQL Development API

  useEffect(() => getStories(), []);

  const getStories = () => {
    //? FETCHES AND MAPS SAVED STORIES
    fetch(baseURL + "stories")
      .then((res) => res.json())
      .then((res) => setStoryList(res))
      .catch((err) => setHasError(true), []);
  };

  const deleteLast = () => {
    //? DELETES LAST STORY SAVED AND RELOADS PAGE
    fetch(baseURL + "stories", { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => console.log(res));
    setTimeout(() => {
      window.location.reload();
    }, 350);
  };

  const render = () => {
    //? RENDERS SAVED STORIES
    return storyList.map((story) => {
      return (
        <div>
          {" "}
          <h3>
            {" "}
            Story {story.id}. {story.title}
          </h3>{" "}
          <p>by {story.author}</p>
          <p>{story.content}</p>{" "}
        </div>
      );
    });
  };

  return (
    <div>
      <h1>All Stories</h1>
      <button onClick={() => 
        // window.location.assign("http://localhost:3000/your_story")
        history.push("/your_story")
        }>
        NEW STORY
      </button>
      <button onClick={deleteLast}>DELETE LAST</button>
      {render()}
      <br></br>
      {hasError && <p>Oops, our bad. Something went froggy.</p>}
    </div>
  );
};

export default ViewStories;
