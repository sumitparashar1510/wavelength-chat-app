import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({ groupMember, setIsGroup }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [groupImage, setGroupImage] = useState(null);
  const [groupName, setGroupName] = useState();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const uploadToCloudinary = (pics) => {
    setIsImageUploading(true)
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "wcynre9m");
    data.append("cloud_name", "dphkkfcg0");
    fetch("https://api-eu.cloudinary.com/v1_1/dphkkfcg0/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("profile image url: ", data);
        setGroupImage(data.url.toString());
        setIsImageUploading(false);
      });
  };

  const handleCreateGroup = () => {
    let userIds = [];
    for (let user of groupMember) {
      userIds.push(user.id);
    }
    const group = {
      userIds,
      chat_name: groupName,
      chat_image: groupImage,
    };
    const data = {
      group,
      token,
    };
    dispatch(createGroupChat(data));
    setIsGroup(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft className="cursor-pointer text-2xl font-bold" />
        <p className="text-xl font-semibold">New Group</p>
      </div>

      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput" className="relative">
          <img
            className="rounded-full w-44 h-44 object-cover"
            src={groupImage || "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579__340.png"}
            alt=""
          />
          {isImageUploading && (
            <CircularProgress className="absolute top-[5rem] left-[6rem]" />
          )}
        </label>
        <input
          type="file"
          id="imgInput"
          className="hidden"
          onChange={(e) => uploadToCloudinary(e.target.files[0])}
        />
      </div>
      <div className="w-full flex justify-between items-center py-2 px-5">
        <input
          className="w-full outline-none border-b-2 border-green-700 px-2 bg-transparent"
          placeholder="Group subject"
          value={groupName}
          type="text"
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      {groupName && (
        <div className="p-[21.5px] bg-slate-200 flex items-center justify-center">
          <Button onClick={handleCreateGroup}>
            <div className="bg-[#0c972d] rounded-full p-2">
              <BsCheck2 className="text-white font-bold text-3xl" />
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewGroup;
