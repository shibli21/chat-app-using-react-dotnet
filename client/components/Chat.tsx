import { ActionIcon, Box, Center, Input, Text, useMantineTheme } from "@mantine/core";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Logout, Send } from "tabler-icons-react";
import { IMessage } from "../pages";

interface ChatProps {
  messages: IMessage[];
  onSendMessage: (message: string) => void;
  onCloseConnection: () => void;
  name: string;
  room: string;
}

const Chat = ({ name, room, messages, onSendMessage, onCloseConnection }: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const theme = useMantineTheme();

  const sendMessage = () => {
    onSendMessage(currentMessage);
    setCurrentMessage("");
  };

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        <Box sx={(theme) => ({ background: theme.colors.violet[8] })}>
          <Center
            px={10}
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Text transform="uppercase" size="lg" weight={700}>
              {room}
            </Text>

            <Logout cursor="pointer" size={20} onClick={onCloseConnection} />
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
            {messages.map((messageContent, i) => {
              return (
                <Box
                  key={messageContent.user}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: name === messageContent.user ? "flex-start" : "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      flexDirection: name !== messageContent.user ? "row-reverse" : "row",
                      maxWidth: "250px",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: "10px", margin: "5px 5px 5px 0" }}>
                      <Text size="xs">{messageContent.user}</Text>
                    </Box>
                    <Box>
                      <Text sx={{ background: theme.colors.gray[8], padding: "2px 2px", lineHeight: 1 }}>
                        {messageContent.message}
                      </Text>
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
