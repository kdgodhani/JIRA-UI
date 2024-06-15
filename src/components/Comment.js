import React, { useState } from "react";
import { CommentSection } from "react-comments-section";
import Wrapper from "../assets/wrappers/Comment";
import { getUserFromLocalStorage } from "../utils/localStorage";
import { Error } from "../pages";
import { useSelector } from "react-redux";
//import 'react-comments-section/dist/index.css'

const Comment = ({ addComment, comments }) => {
  //const { currentTask } = useSelector((store) => store.currentProject);

  // const comments = currentTask.commentaires;
  let data = [];
  if (Array.isArray(comments))
    data = comments.map((item) => {
//   {
//     "commentId": 2,
//     "content": "user 9 ",
//     "author": 9,
//     "taskId": 7,
//     "authorName": "user10@planetx.com"
// },
      return {
        userId: item.author,
        comId: item.commentId,
        fullName: item.authorName,
        // text: item.date.substring(0, 10) + " : " + item.contenu,
        text: item.content,
        avatarUrl:
          "https://ui-avatars.com/api/name=" +
          item.authorName +
          "&background=random",
        replies: [],
      };
    });

  const customNoComment = () => (
    <div className="no-com" style={{ marginLeft: "10%", marginTop: "5%" }}>
      zero comments, be the first to comment on this spot!
    </div>
  );

  return (
    <Wrapper>
      <CommentSection
        currentUser={{
          currentUserId: getUserFromLocalStorage().id,
          currentUserImg:
            "https://ui-avatars.com/api/name=" +
            getUserFromLocalStorage().name +
            "&background=random",

          currentUserFullName: getUserFromLocalStorage().nom,
        }}
        commentData={data}
        customNoComment={() => customNoComment()}
        removeEmoji={true}
        inputStyle={{
          border: "1px solid rgb(208 208 208)",
          width: "100%",
          height: "70%",
          margin: "1%",
        }}
        formStyle={{
          backgroundColor: "white",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 6fr  1fr",
          gridGap: "5px",
        }}
        submitBtnStyle={{
          border: "none",
          backgroundColor: "var(--primary-400)",
          marginLeft: "5%",
          marginTop: "7%",
          borderRadious: "5px",
        }}
        cancelBtnStyle={{
          border: "none",
          backgroundColor: "gray",
          color: "white",
        }}
        titleStyle={{ color: "#30336b", fontSize: "smaller" }}
        overlayStyle={{
          backgroundColor: "#F4EDF6",
          color: "#30336b",
          borderRadious: "10%",
        }}
        onSubmitAction={(
          newData
          /* : {
            userId: string
            comId: string
            avatarUrl: string
            userProfile?: string
            fullName: string
            text: string
            replies: any
            commentId: string
            }*/
        ) => {
          addComment(newData);
        }}
        currentData={(data) => {
        }}
      />
    </Wrapper>
  );
};

export default Comment;
