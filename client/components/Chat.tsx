import { ActionIcon, Avatar, Box, Center, Input, Text, useMantineTheme } from "@mantine/core";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { Send } from "tabler-icons-react";

interface IMessage {
  name: string;
  message: string;
  time: string;
  room: string;
}

interface ChatProps {
  socket: Socket;
  name: string;
  room: string;
}

const Chat = ({ name, room, socket }: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useMantineTheme();

  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData: IMessage = {
        room: room,
        name: name,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <>
      <Box
        sx={(theme) => ({
          minWidth: "400px",
          minHeight: "500px",
          background: theme.colors.dark[6],
          "@media (max-width: 500px)": {
            minWidth: "100vw",
            minHeight: "100vh",
            width: "100vw",
          },
        })}
      >
        <Box sx={(theme) => ({ background: theme.colors.violet[8], height: "30px" })}>
          <Center>
            <Text transform="uppercase" size="lg" weight={700}>
              Live Chat
            </Text>
          </Center>
        </Box>
        <Box
          sx={(theme) => ({
            padding: theme.spacing.lg,
            paddingTop: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(500px - 30px)",
            "@media (max-width: 500px)": {
              height: "calc(100vh - 30px)",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              flex: 1,
              overflowY: "scroll",
              padding: "4px 0",

              "&::-webkit-scrollbar": {
                width: "4px",
                height: "0",
              },
              "&::-webkit-scrollbar-thumb": {
                boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: theme.colors.violet[8],
              },
            })}
          >
            {messageList.map((messageContent) => {
              return (
                <Box
                  key={messageContent.name}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: name === messageContent.name ? "flex-start" : "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      flexDirection: name !== messageContent.name ? "row-reverse" : "row",
                      maxWidth: "250px",
                    }}
                  >
                    <Avatar src={null} size="md" alt="no image here" />
                    <Box>
                      <Text sx={{ background: theme.colors.gray[8], padding: "2px 2px", lineHeight: 1 }}>
                        {messageContent.message}
                      </Text>
                      <Box sx={{ display: "flex", gap: "10px", margin: "2px 0" }}>
                        <Text size="xs">{messageContent.name}</Text>
                        <Text size="xs">{messageContent.time}</Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
            <Box ref={ref} />
          </Box>
          <Input
            type="text"
            value={currentMessage}
            onChange={(e: FormEvent<HTMLInputElement>) => setCurrentMessage(e.currentTarget.value)}
            onKeyPress={(event: any) => {
              event.key === "Enter" && sendMessage();
            }}
            placeholder="write your message"
            rightSection={
              <ActionIcon variant="filled" color="violet" onClick={sendMessage}>
                <Send size={16} />
              </ActionIcon>
            }
          />
        </Box>
      </Box>
    </>
  );
};

export default Chat;
