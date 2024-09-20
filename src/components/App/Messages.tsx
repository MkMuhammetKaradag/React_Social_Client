import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GET_CHAT_MESSAGES } from '../../graphql/queries/GetChatMessages';
import { useAppSelector } from '../../context/hooks';
import { CREATE_MESSAGE_SUBSCRIPTION } from '../../graphql/subscriptions/CreateMessage';
import MessageItem from './MessageItem';
import { Message } from '../../utils/types';

interface MessagesProps {
  chatId: string;
}

const Messages: React.FC<MessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [extraPassValue, setExtraPassValue] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const user = useAppSelector((state) => state.auth.user);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [loadMessages, { loading, data, subscribeToMore }] = useLazyQuery(
    GET_CHAT_MESSAGES,
    {
      variables: { input: { chatId, page, pageSize: 10, extraPassValue: 0 } },
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
  }, [data, page]);

  const loadMoreMessages = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      loadMessages({
        variables: {
          input: { chatId, page: page + 1, pageSize: 10, extraPassValue },
        },
      });
    }
  }, [loading, hasMore, loadMessages, chatId, page, extraPassValue]);

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
          return prev;
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
          loader={<h4 className="text-center py-2">Yükleniyor...</h4>}
          scrollableTarget="scrollableDiv"
          inverse={true}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          endMessage={
            <p className="text-center py-2">
              {messages.length > 0
                ? 'Tüm mesajlar yüklendi!'
                : 'Henüz mesaj yok.'}
            </p>
          }
        >
          <div className="p-4">
            {messages.map((message) => (
              <MessageItem
                key={message._id}
                message={message}
                isCurrentUser={user?._id === message.sender._id}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default React.memo(Messages);
