import React, { useEffect, useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import {
  BsEmojiSmile,
  BsFilter,
  BsMicFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import { Menu, MenuItem } from "@mui/material";
import CreateGroup from "./Group/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import { createChat, getUsersChat } from "../Redux/Chat/Action";
import { createMessage, getAllMessages } from "../Redux/Message/Action";

import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
 
const HomePage = () => {
  const [querys, setQuerys] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isGroup, setIsGroup] = useState(false);
  const dispatch = useDispatch();
  const { auth, chat, message } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const [stompClient, setStompClient] = useState();
  const [isConnect, setIsConnect] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = () => {
    const sock = new SockJS("http://localhost:5454/ws");
    const temp = over(sock);
    setStompClient(temp);

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    };

    temp.connect(headers, onConnect, onError);
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const onError = (error) => {
    console.log("on error ", error);
  };

  const onConnect = () => {
    setIsConnect(true);
  };

  useEffect(() => {
    if (message.newMessage && stompClient) {
      setMessages([...messages, message.newMessage]);
      stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
    }
  }, [message.newMessage]);

  const onMessageRecieve = (payload) => {
    console.log("recieve message-----", JSON.parse(payload.body));
    const recievedMessage = JSON.parse(payload.body);
    setMessages([...messages, recievedMessage]);
  };

  useEffect(() => {
    if (isConnect && stompClient && auth.reqUser && currentChat) {
      const subscription = stompClient.subscribe(
        "/group/" + currentChat.id.toString(),
        onMessageRecieve
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  });

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    setMessages(message.messages);
  }, [message.messages]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };

  const handleClickOnChatCard = (userId) => {
    // setCurrentChat(true);
    dispatch(createChat({ token, data: { userId } }));
    setQuerys("");
  };

  const handleCreateNewMessage = () => {
    dispatch(
      createMessage({
        token,
        data: { chatId: currentChat.id, content: content },
      })
    );
    console.log("created new message");
  };

  useEffect(() => {
    dispatch(getUsersChat({ token }));
  }, [chat.createdChat, chat.createdGroup]);

  const handleNavigate = () => {
    setIsProfile(true);
  };

  const handleCloseOpenProfile = () => {
    setIsProfile(false);
  };

  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  useEffect(() => {
    dispatch(currentUser(token));
  }, [token]);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/signin");
  };

  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signup");
    }
  }, [auth.reqUser]);

  const handleCurrentChat = (item) => {
    setCurrentChat(item);
  };

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(getAllMessages({ chatId: currentChat.id, token }));
    }
  }, [currentChat, message.newMessage]);

  console.log("current chat: " + currentChat);

  return (
    <div className="relative">
      <div className="py-14 bg-[#a020f0] w-full"></div>
      <div className="flex bg-[#f0f2f5] h-[90vh] absolute top-6 left-6 w-[96.5vw]">
        <div className="left w-[30%] bg-[#e8e9ec]">
          {/* profile */}
          {isGroup && <CreateGroup setIsGroup={setIsGroup} />}
          {isProfile && (
            <div className="w-full h-full">
              <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
            </div>
          )}
          {/* home */}
          {!isProfile && !isGroup && (
            <div className="w-full">
              <div className="flex justify-between items-center p-3">
                <div
                  onClick={handleNavigate}
                  className="flex items-center space-x-3"
                >
                  <img
                    className="rounded-full h-10 w-10 cursor-pointer"
                    src={
                      auth.reqUser?.profile_picture ||
                      "https://cdn.pixabay.com/photo/2016/08/31/11/54/icon-1633249_1280.png"
                    }
                    alt=""
                  />
                  <p className="cursor-pointer">{auth.reqUser?.full_name}</p>
                </div>
                <div className="space-x-3 text-2xl flex">
                  <TbCircleDashed
                    className="cursor-pointer"
                    onClick={() => navigate("/status")}
                  />
                  <BiCommentDetail className="cursor-pointer" />
                  <div>
                    <BsThreeDotsVertical
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      className="cursor-pointer text-2xl"
                    />

                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={handleCreateGroup}>
                        Create Group
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center items-center bg-white py-4 px-2 pl-3">
                <input
                  className="border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2"
                  type="text"
                  placeholder="Search or start new Chat"
                  onChange={(e) => {
                    setQuerys(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  value={querys}
                />
                <AiOutlineSearch className="top-7 left-6 absolute" />
                <div>
                  <BsFilter className="ml-3 text-3xl" />
                </div>
              </div>
              {/* all users */}
              <div className="bg-white overflow-y-scroll px-3 h-[66.75vh]">
                {querys &&
                  auth.searchUser?.map((item) => (
                    <div onClick={() => handleClickOnChatCard(item.id)}>
                      <hr />
                      <ChatCard
                        name={item.full_name}
                        userImg={
                          item.profile_picture ||
                          "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                        }
                      />
                    </div>
                  ))}

                {chat.chats.length > 0 &&
                  !querys &&
                  chat.chats?.map((item) => (
                    <div onClick={() => handleCurrentChat(item)}>
                      <hr />
                      {item.group ? (
                        <ChatCard
                          name={item.chat_name}
                          userImg={
                            item.chat_image ||
                            "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                          }
                        />
                      ) : (
                        <ChatCard
                          name={
                            auth.reqUser?.id !== item.users[0]?.id
                              ? item.users[0].full_name
                              : item.users[1].full_name
                          }
                          userImg={
                            auth.reqUser.id !== item.users[0].id
                              ? item.users[0].profile_picture ||
                                "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                              : item.users[1].profile_picture ||
                                "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                          }
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        {/* default page */}
        {!currentChat && (
          <div className="right w-[70%]">
            <div className="max-w-[100%]">
              <div className="text-center flex flex-col items-center justify-center mx-32 my-16">
                <img
                  className="h-60 w-80 mb-8 object-cover"
                  src="https://img.freepik.com/free-vector/group-people-waving-hand_23-2148361693.jpg"
                  alt=""
                />
                <h1 className="text-4xl text-[#a020f0]">Wave👋length🛜</h1>
                <p className="my-9">
                  Send and recieve message without keeping your phone online.
                  Use Wavelength on up to 4 linked devices and 1 phone at the same
                  time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* message part */}
        {currentChat && (
          <div className="w-[70%] relative">
            <div className="header absolute top-0 w-full bg-[#f0f2f5]">
              <div className="flex justify-between">
                <div className="py-3 space-x-4 flex items-center px-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={
                      currentChat.group
                        ? currentChat.chat_image
                        : auth.reqUser.id !== currentChat.users[0].id
                        ? currentChat.users[0].profile_picture ||
                          "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                        : currentChat.users[1].profile_picture ||
                          "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                    }
                    alt=""
                  />
                  <p>
                    {currentChat.group
                      ? currentChat.chat_name
                      : auth.reqUser?.id === currentChat.users[0].id
                      ? currentChat.users[1].full_name
                      : currentChat.users[0].full_name}
                  </p>
                </div>
                <div className="py-3 space-x-4 flex items-center px-3">
                  <AiOutlineSearch />
                  <BsThreeDotsVertical />
                </div>
              </div>
            </div>
            {/* message section */}
            <div className="px-10 h-[78vh] overflow-y-scroll bg-[#ffffd3]">
              <div className="space-y-1 flex flex-col justify-center mt-20 py-2">
                {messages.length > 0 &&
                  messages?.map((item, i) => (
                    <MessageCard
                      isReqUserMessage={item.user.id === auth.reqUser.id}
                      content={item.content}
                    />
                  ))}
              </div>
            </div>

            {/* footer part */}

            <div className="footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl">
              <div className="flex justify-center items-center space-x-3 relative">
                <BsEmojiSmile className="cursor-pointer" />
                <ImAttachment />

                <input
                  className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
                  type="text"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type message..."
                  value={content}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreateNewMessage();
                      setContent("");
                    }
                  }}
                />
                <BsMicFill />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
