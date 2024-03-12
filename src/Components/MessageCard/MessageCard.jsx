import React from 'react'

const MessageCard = ({ isReqUserMessage,content }) => {
  return (
    <div className={`p-2 rounded-md max-w-[50%] ${!isReqUserMessage?"self-start bg-white":"self-end text-white bg-[#a020f0]"}`}>
        <p>{content}</p>
    </div>
  )
}

export default MessageCard