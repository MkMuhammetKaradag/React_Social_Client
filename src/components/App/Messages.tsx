import React, { useState, useEffect, useRef } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GET_CHAT_MESSAGES } from '../../graphql/queries/GetChatMessages';
import { useAppSelector } from '../../context/hooks';
import { CREATE_MESSAGE_SUBSCRIPTION } from '../../graphql/subscriptions/CreateMessage';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    userName: string;
    profilePhoto: string | null;
  };
}

interface MessagesProps {
  chatId: string;
}

const Messages: React.FC<MessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [extraPassValue, setExtraPassValue] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const user = useAppSelector((s) => s.auth.user);

  const [loadMessages, { loading, data, subscribeToMore }] = useLazyQuery(
    GET_CHAT_MESSAGES,
    {
      variables: {
        input: { chatId, page, pageSize: 10, extraPassValue: 0 },
      },
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (chatId) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      setIsInitialLoad(true);
      loadMessages();
    }
  }, [chatId, loadMessages]);

  useEffect(() => {
    if (data?.getChatMessage) {
      const { messages: newMessages, totalPages } = data.getChatMessage;
      setMessages((prevMessages) => [
        ...newMessages.slice().reverse(),
        ...prevMessages,
      ]);
      setHasMore(page < totalPages);
      setIsInitialLoad(false);
    }
  }, [data]);

  const loadMoreMessages = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      loadMessages({
        variables: {
          input: {
            chatId,
            page: page + 1,
            pageSize: 10,
            extraPassValue: extraPassValue,
          },
        },
      });
    }
  };

  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableRef.current && isInitialLoad) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (subscribeToMore) {
      const unsubscribe = subscribeToMore({
        document: CREATE_MESSAGE_SUBSCRIPTION,
        variables: { chatId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const newMessage = subscriptionData.data.createMessageToChat;
          setExtraPassValue((prev) => prev + 1);
          if (newMessage) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
          // return {
          //   ...prev,
          //   getChatMessage: {
          //     ...prev.getChatMessage,
          //     messages: [newMessage, ...prev.getChatMessage.messages],
          //   },
          // };
        },
      });

      return () => unsubscribe();
    }
  }, [subscribeToMore, chatId]);

  return (
    <div className="flex-grow overflow-hidden" ref={scrollableRef}>
      <div
        id="scrollableDiv"
        className="h-full overflow-y-auto flex flex-col-reverse"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={loadMoreMessages}
          hasMore={hasMore}
          loader={<h4 className="text-center py-2">Loading...</h4>}
          scrollableTarget="scrollableDiv"
          inverse={true}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          endMessage={
            <p className="text-center py-2">
              {messages.length > 0
                ? "That's all the messages!"
                : 'No messages yet.'}
            </p>
          }
        >
          <div className="p-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`mb-2 p-2 space-x-2  flex  ${
                  user?._id == message.sender._id ? 'justify-end' : ''
                }`}
              >
                {!(user?._id == message.sender._id) && (
                  <img
                    src={
                      message.sender.profilePhoto ||
                      'https://via.placeholder.com/40'
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <div
                  className={`${
                    user?._id == message.sender._id
                      ? 'rounded-tl-xl bg-sky-100  text-gray-900 '
                      : 'rounded-tr-xl bg-slate-100'
                  }  p-2 shadow rounded-b-xl  `}
                >
                  {!(user?._id == message.sender._id) && (
                    <span className="font-semibold">
                      {message.sender.userName}
                    </span>
                  )}

                  <p className="mt-2">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Messages;
