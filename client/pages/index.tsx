import { Box, Button, Card, Center, Input, Stack, Text } from "@mantine/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import type { NextPage } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Chat from "../components/Chat";

export interface IMessage {
  user: string;
  message: string;
}

const Home: NextPage = () => {
  const [name, setName] = useState("shibli");
  const [room, setRoom] = useState("405");
  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const joinRoom = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:5001/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (user, message) => {
        setMessages((messages) => [...messages, { user, message }]);
      });

      connection.onclose(async (e) => {
        setConnection(undefined);
        setMessages([]);
      });

      await connection.start();
      await connection.invoke("JoinRoom", { user: name, room });
      setConnection(connection);
    } catch (error) {}
  };

  const onCloseConnection = async () => {
    try {
      await connection?.stop();
    } catch (error) {}
  };

  const sendMessage = async (message: string) => {
    try {
      await connection?.invoke("SendMessage", message);
    } catch (error) {}
  };

  return (
    <Center
      sx={{
        marginTop: "200px",
        "@media (max-width: 500px)": {
          marginTop: "0",
        },
      }}
    >
      <Box
        sx={(theme) => ({
          minWidth: "400px",
          minHeight: "500px",
          background: theme.colors.gray[9],
          "@media (max-width: 500px)": {
            minWidth: "100vw",
            minHeight: "100vh",
            width: "100vw",
            height: "100vh",
          },
        })}
      >
        {!connection ? (
          <Card
            sx={(theme) => ({
              "@media (max-width: 500px)": {
                height: "100vh",
              },
            })}
          >
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                joinRoom();
              }}
            >
              <Text transform="uppercase" size="lg" weight={700}>
                Join a room to chat
              </Text>

              <Card.Section>
                <Center>
                  <Image src="/undraw_online_chat_re_c4lx.svg" alt="online-chat" width="300" height="300" />
                </Center>
              </Card.Section>

              <Stack>
                <Input
                  value={name}
                  placeholder="Your name"
                  onChange={(event: FormEvent<HTMLInputElement>) => setName(event.currentTarget.value)}
                />
                <Input
                  value={room}
                  placeholder="Room name"
                  onChange={(event: FormEvent<HTMLInputElement>) => setRoom(event.currentTarget.value)}
                />
                <Button type="submit" color="violet" fullWidth>
                  Join Now
                </Button>
              </Stack>
            </form>
          </Card>
        ) : (
          <Chat
            messages={messages}
            name={name}
            room={room}
            onSendMessage={sendMessage}
            onCloseConnection={onCloseConnection}
          />
        )}
      </Box>
    </Center>
  );
};

export default Home;
