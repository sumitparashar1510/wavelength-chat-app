import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { searchUser } from "../../Redux/Auth/Action";
import { useDispatch, useSelector } from "react-redux";

const CreateGroup = ({ setIsGroup }) => {
  const [newGroup, setNewGroup] = useState(false);
  const [query, setQuery] = useState("");
  const [groupMember, setGroupMember] = useState(new Set());
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { auth } = useSelector((store) => store);

  const handleRemoveMember = (item) => {
    groupMember.delete(item);
    setGroupMember(groupMember);
  };

  const handleSearch = () => {
    dispatch(searchUser({ keyword: query, token }));
  };

  return (
    <div className="w-full h-full">
      {!newGroup && (
        <div>
          <div className="flex items-center space-x-7 bg-[#008069] text-white pt-16 pb-5 px-6">
            <BsArrowLeft className="cursor-pointer text-2xl font-bold" />
            <p className="text-xl font-semibold">Add Group Participants</p>
          </div>
          <div className="relative bg-white px-3 py-4">
            <div className="flex space-x-2 flex-wrap space-y-1">
              {groupMember.size > 0 &&
                Array.from(groupMember).map((item) => (
                  <SelectedMember
                    handleRemoveMember={() => handleRemoveMember(item)}
                    member={item}
                  />
                ))}
            </div>
            <input
              type="text"
              onChange={(e) => {
                handleSearch(e.target.value);
                setQuery(e.target.value);
              }}
              className="outline-none border-b border-[#8888] p-2 w-[93%]"
              placeholder="Search user"
              value={query}
            />
          </div>
          <div className="bg-white overflow-y-scroll h-[43.7vh]">
            {query &&
              auth.searchUser?.map((item) => (
                <div
                  onClick={() => {
                    groupMember.add(item);
                    setGroupMember(groupMember);
                    setQuery("");
                  }}
                  key={item?.id}
                >
                  <hr />
                  <ChatCard
                    userImg={item.profile_picture}
                    name={item.full_name || item.chat_name}
                  />
                </div>
              ))}
          </div>

          <div className="bottom-10 py-5 flex bg-slate-200 items-center justify-center">
            <div
              className="bg-green-500 rounded-full p-2 cursor-pointer"
              onClick={() => {
                setNewGroup(true);
              }}
            >
              <BsArrowRight className="text-white font-bold text-3xl" />
            </div>
          </div>
        </div>
      )}
      {newGroup && (
        <NewGroup setIsGroup={setIsGroup} groupMember={groupMember} />
      )}
    </div>
  );
};

export default CreateGroup;
